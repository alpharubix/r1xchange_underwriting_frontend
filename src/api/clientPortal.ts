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


export type ClientPortal = "user" | "ANCHOR" | "ADMIN";

export function getClientPortal(): ClientPortal {
  const pathname = window.location.pathname.toLowerCase();
  const isAnchorPath =
    pathname === "/anchors" ||
    pathname.startsWith("/anchors/") ||
    pathname.startsWith("/anchors");

  const isAdminPath = pathname === "/admins" || pathname.startsWith("/admins/") || pathname.startsWith("/admins")

  if (isAdminPath){
    return "ADMIN";
  }
  if (isAnchorPath) {
    return "ANCHOR";
  }

  return "user";
}