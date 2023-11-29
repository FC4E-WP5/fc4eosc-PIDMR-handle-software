/**********************************************************************\
 © COPYRIGHT 2019 Corporation for National Research Initiatives (CNRI);
                        All rights reserved.

        The HANDLE.NET software is made available subject to the
      Handle.Net Public License Agreement, which may be obtained at
          http://hdl.handle.net/20.1000/112 or hdl:20.1000/112
\**********************************************************************/

package net.handle.hdllib.trust;

import java.util.List;

import com.google.gson.annotations.SerializedName;

public class JsonWebSignatureJsonSerialization {
    String payload;
    List<JsonWebSignatureSignatureJsonSerialization> signatures;

    public static class JsonWebSignatureSignatureJsonSerialization {
        @SerializedName("protected")
        String protectedPart;
        String signature;
    }
}
