# pidmr-handle-software



## Proof of Concept

To provide a proof of concept for integrating the functionality of the on-board resolution mechanisem of the Handle Software called Template Handle an idea of extending the source code was developed.

Based on the above idea to simulate the function of the Template Handle and extend the functionality already implemented within PIDMR resolution concept and to provide flexible PID resolution of any type the original Handle Software code was extended.

The extended code is marked as "This is extended code".

## Local developmemnt

For local development clone the repository to your local machine as follow:
```
git clone https://gitlab-ce.gwdg.de/epic/pidmr-handle-software.git
```

## Code extension

Entrance point for routing is defined in [Main.java](https://gitlab-ce.gwdg.de/epic/pidmr-handle-software/-/blob/main/src/main/java/net/handle/server/Main.java?ref_type=heads#L398) file as follow:

```
 ServletMapping mapping = new ServletMapping();
 mapping.setServletName(HDLProxy.class.getName());
 mapping.setPathSpec("/*");
```

and HDLProxy servlet takes care of processing the requests, including GET and POST requests, which could be found at:

```
/src/main/java/net/handle/apps/servlet_proxy/HDLProxy.java
```
POST requests sent via the resolving form are received by the doPost method in the above servlet. Some parameters are sent with the request including the pid (hdl), a resolution mode (display) from either landingpage, metadata or resource and a flag (redirect) for whether to redirect the request to a given url in the database or process the request by the Handle Proxy server itself. The provided flag (redirect) is native to Handle Software itself and is only used for processing Handle PIDs.

First step is to determine the type of the PID provided by the request. For determination of the PID type the information provided by the PIDMR API for [providers](https://apimr.devel.argo.grnet.gr/v1/providers) is used.

Upon determining the PID type a corresponding handling of the request is executed based on the resolution mode. For landingpage and metadata mode a redirect request is sent to the local PID resolution service API. For resource mode, provided the local provider provides the information, the metadata of the requested PID is fetched, processed and the required resource end point is extracted from the metadata to which the resource mode request is then sent.

For the purpose of adapting the Handle Proxy Server for integrating the resolution function of the Handle Template the extended code has to be complied first using the following command in the root directory of the repository for ubuntu operating system for example.

 ```
./gradlew build
 ```

Upon compilation a java jar called “handle-9.3.1.jar” is created depending on the version of the underlying Handle Software implemented under

 ```
/build/libs/handle-9.3.1.jar
```
The “handle-9.3.1.jar” of the Handle Proxy server located at

handle-9.3.1/lib/ handle-9.3.1.jar

has to be replaced with the above compiled jar and the Proxy Server should be restarted for the changes to take effect.