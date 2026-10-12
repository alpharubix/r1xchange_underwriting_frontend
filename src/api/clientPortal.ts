// import { clientLogos } from "@/pages/marketing/clientLogos";

// export type ClientPortal = "user" | "anchor";

// export function getClientPortal():ClientPortal{
//     const hostname = window.location.hostname
//     const pathname = window.location.pathname

//     console.log('Hostname ',hostname,'Path name ',pathname)

//     if(hostname==="checkcrisp.com" && pathname.startsWith('/anchors'))
//     {
//         return "anchor";
//     }

//     if(hostname==="checkcrisp.com"){
//         return "user"
//     }
//     if (hostname === "localhost" || hostname === "127.0.0.1") {
//     const portal = new URLSearchParams(search).get("portal");

//     if (portal === "user" || portal === "anchor") {
//       return portal;
//     }
//   }
//    throw new Error(
//     `Unable to identify client portal: ${hostname}${pathname}`
//   );
// }


export type ClientPortal = "user" | "ANCHOR";

export function getClientPortal(): ClientPortal {
  const { hostname, pathname} = window.location;


    console.log("Hostname:", hostname);
  console.log("Pathname:", pathname);

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return pathname === "/anchors" ||
      pathname.startsWith("/anchors/")
      ? "ANCHOR"
      : "user";
  }
  console.log("path name :",pathname)
  if (hostname === "checkcrisp.com" && (pathname === "/anchors" || pathname.startsWith("/anchors/"))) {
    return "ANCHOR";
  }

  if (hostname === "checkcrisp.com") {
    return "user";
  }

  throw new Error(`Unknown portal: ${hostname}${pathname}`);
}