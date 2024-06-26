/**********************************************************************\
 © COPYRIGHT 2019 Corporation for National Research Initiatives (CNRI);
                        All rights reserved.

        The HANDLE.NET software is made available subject to the
      Handle.Net Public License Agreement, which may be obtained at
          http://hdl.handle.net/20.1000/112 or hdl:20.1000/112
\**********************************************************************/

package net.handle.server.servletcontainer.auth;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import com.google.gson.JsonObject;
import net.handle.hdllib.AbstractMessage;
import net.handle.server.servletcontainer.servlets.BaseHandleRequestProcessingServlet;
import org.apache.commons.codec.binary.Base64;

import net.cnri.util.ServletUtil;
import net.cnri.util.StringUtils;
import net.handle.hdllib.Util;
import net.cnri.servletcontainer.TlsRenegotiationRequestor;

public class StandardHandleAuthenticationFilter implements Filter {
    private static final String WWW_AUTHENTICATE_HEADER = "WWW-Authenticate";

    private net.handle.server.servletcontainer.HandleServerInterface handleServer;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        handleServer = (net.handle.server.servletcontainer.HandleServerInterface) filterConfig.getServletContext().getAttribute("net.handle.server.HandleServer");
    }

    @Override
    public void destroy() {
        // no-op
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (request instanceof HttpServletRequest && response instanceof HttpServletResponse) {
            doHttpFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
        } else {
            chain.doFilter(request, response);
        }
    }

    private void doHttpFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        HandleAuthorizationHeader handleAuthHeader = parseHandleAuthorizationHeader(request);
        if (requestTlsRenegotiationReturnTerminal(handleAuthHeader, request, response)) return;
        AuthenticationResponse authResp = new AuthenticationResponse();
        request.setAttribute(AuthenticationResponse.class.getName(), authResp);
        HeaderFixingResponseWrapper wrappedResponse = new HeaderFixingResponseWrapper(request, response);
        if (request.isSecure() && !sessionsApi(request)) {
            HandleAuthenticationStatus status;
            if (handleAuthHeader != null && handleAuthHeader.requiresSession()) {
                status = HandleAuthenticationStatus.fromSession(request.getSession(), true);
            } else {
                status = HandleAuthenticationStatus.fromSession(request.getSession(false), false);
            }
            status = processAuthenticationResponse(request, status, handleAuthHeader, authResp);
            new StandardHandleAuthenticator(request, request.getSession(false), status, authResp).authenticate();
            if (authResp.isAuthenticating() && !authResp.isAuthenticated()) {
                wrappedResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } else if (authResp.getServerSignature() != null) {
                wrappedResponse.addWwwAuthenticateHandleHeader();
            }
        }
        chain.doFilter(request, wrappedResponse);
    }

    public static boolean requestTlsRenegotiationReturnTerminal(HandleAuthorizationHeader handleAuthHeader, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (handleAuthHeader == null) return false;
        if (!req.isSecure()) return false;
        Boolean wantClientAuth = handleAuthHeader.getClientCertAsBooleanObject();
        boolean force = handleAuthHeader.isRequestingForceRenegotiate();
        if (!TlsRenegotiationRequestor.isWantingTlsRenegotiation(req, wantClientAuth, force)) {
            return false;
        }
        TlsRenegotiationRequestor tlsRenegotiationRequestor = (TlsRenegotiationRequestor) req.getAttribute(TlsRenegotiationRequestor.class.getName());
        if (tlsRenegotiationRequestor == null) {
            // TLS renegotiation is unavailable
            resp.setStatus(HttpServletResponse.SC_NOT_IMPLEMENTED);
            return true;
        }
        if (wantClientAuth != null && !wantClientAuth.booleanValue() && tlsRenegotiationRequestor.isNeedClientAuth()) {
            // can't downgrade to no client auth
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return true;
        }
        if (!tlsRenegotiationRequestor.isRequestSupportsTlsRenegotiation()) {
            JsonObject json = new JsonObject();
            json.addProperty("responseCode", AbstractMessage.RC_PROTOCOL_ERROR);
            json.addProperty("message", "Authorization: Handle clientCert requires TLS renegotiation. Request using HTTP/1.1 over TLS 1.2, and/or change server configuration.");
            BaseHandleRequestProcessingServlet.processResponse(req, resp, HttpServletResponse.SC_BAD_REQUEST, json);
            return true;
        }
        try {
            tlsRenegotiationRequestor.requestTlsRenegotiation(wantClientAuth, 1, TimeUnit.MINUTES);
            return false;
        } catch (TimeoutException e) {
            JsonObject json = new JsonObject();
            json.addProperty("responseCode", AbstractMessage.RC_PROTOCOL_ERROR);
            json.addProperty("message", "Renegotiation handshake timed out");
            BaseHandleRequestProcessingServlet.processResponse(req, resp, HttpServletResponse.SC_BAD_REQUEST, json);
            return true;
        }
    }

    private HandleAuthorizationHeader parseHandleAuthorizationHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return HandleAuthorizationHeader.fromHeader(authHeader);
    }

    private HandleAuthenticationStatus processAuthenticationResponse(HttpServletRequest request, HandleAuthenticationStatus status, HandleAuthorizationHeader handleAuthHeader, AuthenticationResponse authResp) {
        if (handleAuthHeader != null) {
            request.setAttribute(HandleAuthorizationHeader.class.getName(), handleAuthHeader);
            if (handleAuthHeader.requiresSession()) {
                authResp.setSessionId(status.getSessionId());
                authResp.setNonce(status.getNonce());
                if (handleAuthHeader.isAuthenticating()) {
                    authResp.setAuthenticating(true);
                }
                status = HandleAuthenticationStatus.processServerSignature(status, handleServer, request.getSession(), handleAuthHeader, authResp);
            }
        }
        return status;
    }

    private static boolean sessionsApi(HttpServletRequest request) {
        String path = getPath(request);
        return ("/api/sessions".equals(path) || path.startsWith("/api/sessions/"));
    }

    private static String getPath(HttpServletRequest servletReq) {
        String path = ServletUtil.pathExcluding(servletReq.getRequestURI(), servletReq.getContextPath());
        path = StringUtils.decodeURLIgnorePlus(path);
        return path;
    }

    static String quote(String s) throws UnsupportedEncodingException {
        s = new String(Util.encodeString(s), "US-ASCII");
        s = s.replaceAll("\\p{Cntrl}", "");
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private static class HeaderFixingResponseWrapper extends HttpServletResponseWrapper {
        private static final String ACCESS_CONTROL_EXPOSE_HEADERS = "Access-Control-Expose-Headers";

        private final HttpServletRequest request;
        private final Set<String> exposedHeaders;

        public HeaderFixingResponseWrapper(HttpServletRequest request, HttpServletResponse response) {
            super(response);
            this.request = request;
            if (request.getHeader("Origin") != null) {
                exposedHeaders = new HashSet<>();
                exposedHeaders.add("Content-Length");
                fixResponseExposeHeaders();
            } else {
                exposedHeaders = null;
            }
        }

        private void fixResponseExposeHeaders() {
            Collection<String> headers = getHeaders(ACCESS_CONTROL_EXPOSE_HEADERS);
            if (headers == null) return;
            for (String header : headers) {
                if (header != null && !header.isEmpty()) {
                    for (String field : header.split(",")) {
                        exposedHeaders.add(field);
                    }
                }
            }
            if (exposedHeaders.isEmpty()) super.setHeader(ACCESS_CONTROL_EXPOSE_HEADERS, null);
            else super.setHeader(ACCESS_CONTROL_EXPOSE_HEADERS, commify(exposedHeaders));
        }

        @Override
        public void setStatus(int sc) {
            super.setStatus(sc);
            addAuthenticateHeaders(sc);
        }

        @Override
        @Deprecated
        public void setStatus(int sc, String sm) {
            super.setStatus(sc, sm);
            addAuthenticateHeaders(sc);
        }

        @Override
        public void setDateHeader(String name, long date) {
            exposeHeader(name);
            super.setDateHeader(name, date);
        }

        @Override
        public void addDateHeader(String name, long date) {
            exposeHeader(name);
            super.addDateHeader(name, date);
        }

        @Override
        public void setHeader(String name, String value) {
            exposeHeader(name);
            super.setHeader(name, value);
        }

        @Override
        public void addHeader(String name, String value) {
            exposeHeader(name);
            super.addHeader(name, value);
        }

        @Override
        public void setIntHeader(String name, int value) {
            exposeHeader(name);
            super.setIntHeader(name, value);
        }

        @Override
        public void addIntHeader(String name, int value) {
            exposeHeader(name);
            super.addIntHeader(name, value);
        }

        private boolean isSimpleHeader(String name) {
            return name.equalsIgnoreCase("Cache-Control") || name.equalsIgnoreCase("Content-Language") || name.equalsIgnoreCase("Content-Type") || name.equalsIgnoreCase("Expires") || name.equalsIgnoreCase("Last-Modified")
                || name.equalsIgnoreCase("Pragma");
        }

        private void exposeHeader(String name) {
            if (exposedHeaders != null && !name.toLowerCase().startsWith("access-control-") && !isSimpleHeader(name)) {
                exposedHeaders.add(name);
                super.setHeader(ACCESS_CONTROL_EXPOSE_HEADERS, commify(exposedHeaders));
            }
        }

        private String commify(Collection<String> ss) {
            StringBuilder sb = new StringBuilder();
            boolean first = true;
            for (String s : ss) {
                if (!first) sb.append(",");
                first = false;
                sb.append(s);
            }
            return sb.toString();
        }

        private void addAuthenticateHeaders(int sc) {
            if (sc == HttpServletResponse.SC_UNAUTHORIZED) {
                if (request.isSecure()) {
                    if (!containsHeader(WWW_AUTHENTICATE_HEADER)) {
                        if (requestMayWantBasicAuth()) addHeader(WWW_AUTHENTICATE_HEADER, "Basic realm=\"handle\"");
                        addWwwAuthenticateHandleHeader();
                    }
                } else {
                    // no authentication allowed in insecure channels
                    super.setStatus(SC_FORBIDDEN);
                }
            }
        }

        private boolean requestMayWantBasicAuth() {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null) {
                return authHeader.startsWith("Basic");
            }
            return !("XMLHttpRequest".equals(request.getHeader("X-Requested-With")));
        }

        public void addWwwAuthenticateHandleHeader() {
            AuthenticationResponse authResp = (AuthenticationResponse) request.getAttribute(AuthenticationResponse.class.getName());
            if (authResp.getSessionId() == null) addSessionInfo(authResp);
            StringBuilder sb = new StringBuilder();
            sb.append("Handle sessionId=\"").append(authResp.getSessionId()).append("\"");
            sb.append(", nonce=\"").append(Base64.encodeBase64String(authResp.getNonce())).append("\"");
            if (authResp.getServerSignature() != null) {
                sb.append(", serverAlg=\"").append(authResp.getServerAlg()).append("\"");
                sb.append(", serverSignature=\"").append(Base64.encodeBase64String(authResp.getServerSignature())).append("\"");
            }
            if (!authResp.getErrors().isEmpty()) {
                sb.append(", error=\"").append(combineErrorsForHeader(authResp.getErrors())).append("\"");
            }
            addHeader(WWW_AUTHENTICATE_HEADER, sb.toString());
        }

        private void addSessionInfo(AuthenticationResponse authResp) {
            HandleAuthenticationStatus status = HandleAuthenticationStatus.fromSession(request.getSession(), true);
            authResp.setSessionId(status.getSessionId());
            authResp.setNonce(status.getNonce());
        }

        private static String combineErrorsForHeader(Collection<String> errors) {
            StringBuilder sb = new StringBuilder();
            for (String error : errors) {
                if (sb.length() > 0) sb.append("; ");
                escapeErrorForHeader(sb, error);
            }
            return sb.toString();
        }

        private static void escapeErrorForHeader(StringBuilder sb, String error) {
            for (byte b : Util.encodeString(error)) {
                if (b == '"') sb.append("\\\"");
                else if (b == '\\') sb.append("\\\\");
                else if (b >= 32 && b < 127 && b != '%') sb.append((char) b);
                else {
                    sb.append("%");
                    sb.append(StringUtils.encodeHexChar(b));
                }
            }
        }

    }
}
