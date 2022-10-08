
\subsection{Distributed systems}
\label{sec:background-web-terminology}

In software development of distributed systems, the following phrases exist: 
\begin{enumerate}[-]
  \item Client and Server 
  \item Frontend and backend
  \item Native application and web application
  \item web application and website
\end{enumerate}
While these phrases do overlap to an extend, years of interchangeable usage have lead to their differences often being overlooked. 
This study wishes to shed light on the relationships between these phenomena, as the nuances between them are vital to this studies contribution.

\subsubsection*{The client-server model}

\begin{figure}
  \centering
  \graphicspath{ {../../assets/images/misc/} }
  \includegraphics[width=380px]{todo.jpg}
  \caption{A typical client-server interaction) }
  \label{fig:client-server}
\end{figure}

First, the client-server model. 
The client-server model refers to a distributed application architecture which balances storage and processing responsibilities between two cooperating types of programs: 
Clients and servers.
In this model, a client sends a request to a server, and the server provides the response asked for (see \reffig{fig:client-server}).
While this model immediately invokes images of web clients and web servers, it is important to recognize that the client-server model is far older than either web applications, or the World Wide Web in general. 
It is an abstract computational model, of which the World Wide Web is just one example.
A corresponding client and server may even exist on the same machine. 
A program running on a machine can act as a client, a server, or both, based on the role this program sets out to fulfill in relationship to other programs. 

The client-server model is beneficial for sharing resources, both in terms of storage and processing. 
A distinction is made between centralized models, in which the bulk of these resources are centralized on one or more servers, and decentralized models, which distribute and offload some or all of the computational resources to the clients. 
A centralized model has the advantage of making clients simple and interchangeable, at the cost of making them highly reliant on the uptake of and connection to the server. This also generates more client-server traffic. 
A decentralized model makes clients independent and decreases traffic, at the cost of the complications caused by decentralized architectures. 
The choice between a centralized or decentralized client-server model is therefore highly reliant on the resources of client and server hardware, as well as the quality of the connection between the server and client.  

\subsubsection*{Frontend and backend}

The terms frontend and backend, though closely related to clients and servers, refer to different phenomenon. 
Both are separations of concerns, a design principle prevalent in computer science to specialize a program into separate responsibilities. 
However, client and server programs are defined by their separation into "requester" and "responder" roles, whereas the frontend and backend are defined by their separation into "presentation" and "data access" functions. 
Presentation functions are responsible for interacting with the end-user of the application, and is concerned with aspects such as user interface, user interaction, and rendering.
"data access" interacts with the physical hardware of the machine, and is concerned with aspects such as storage methods, database management, and scalability.  
It just so happens that the presentation functions often corresponds with a requester role,
and that data access functions often corresponds with the responder role.
However, this is never a given. 
A server can be responsible for providing both the frontend and backend functionality, in the case the presentation of an application is rendered on this server. 

\subsubsection*{Native application and web application}

The nuances between a web application and a native application must also be specified, alongside their relationship to clients and servers. 
In this context, we make a distinction between \emph{Programs}, which refer to individual processes on either the side of the client or the server, and an \emph{application}, which either represents a non-distributed, self contained program, or represents the whole of corresponding client and server programs together.
Client programs or server programs are also often abbreviated as clients and servers.  
If a client runs without the corresponding server it relies upon, we can say that the client functions, but the entire \emph{application} does not function. 
In practice, however, the term 'web app' often specifically refers to the client, confusingly enough.

In any case, a program is considered native if it directly runs on the operating system of a device.
A program is considered web-based or browser-based if a browser is required to run it. 
A web application always has a client, as it will always need to be initially served by a corresponding server.
However, the extent to which the functionality of a web app is self contained or continuously reliant on this server may vary.
A native program may also be a client, as there is nothing preventing a native program of making the exact same web request as a web application. 

Due to this ambiguity of 'client-side' being able to refer to both native and web clients, this study makes use of the terminology 'browser-based programs' or 'browser-based applications', to point to web clients in particular. 

Web applications have specific advantages and disadvantages compared to native applications. 
The big advantages are that web applications are cross-platform by nature, and offer ease of accessibility, since no installment or app-store interaction is required to run or update the app (src: vpl 2019, src: hybrid).
As soon as a web app is found, it can theoretically be used.
The containerized nature of the web also makes web applications in general more safe. 
For unknown native applications there is always a danger of installing malicious software, whereas an unknown web application without any privileges is practically harmless (Needs citation). 
The ability to share an application with a link, or to embed it within the larger context of a webpage, is also not a trivial advantage.

The disadvantage is that normally, web applications can only be written in JavaScript, a very-high level interpreted programming language. 
Its high-level nature leads to imprecision in using computational resources. 
For example, it makes no distinction between integer and floating point arithmetic.  
Additionally, the safety and containerization demands of the web make web applications more removed from the operating system and hardware.
Any type of \ac{os} interaction such as opening a window, interacting with the file system, or drawing directly to the screen buffer, is off-limits.  
Both these layers of indirection makes web applications traditionally unfavorable for demanding, highly specialized programs. 

\subsubsection*{Web application and website}

Lastly, a soft distinction is also made between websites, and web applications. 
Roughly speaking, a web application is a website which requires javascript in order to be functional.
This makes websites more static, and web applications more dynamic, being able to change based on user input.  
Wikipedia (Source) can be considered a website, whereas overleaf (Source) is definitively a web application. 
Many border cases also exist, like Twitter (Source).
Following the above definition, twitter is a web application, despite the fact that its core functionalities could be implemented without any client-side javascript.

\begin{note}
  Sources: 

  (https://en.wikipedia.org/wiki/Web_application, bad source, but this is more 'conventional wisdom' than true 'knowledge', couldn't find a more credible source, 
  
  what would make a person credible on this content?)
  
  (https://en.wikipedia.org/wiki/Frontend_and_backend)
\end{note}
