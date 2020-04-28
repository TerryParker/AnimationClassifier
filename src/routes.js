import Dashboard from "./views/Dashboard.jsx";
import Upload from "./views/Upload.jsx";
import ImageTable from "./views/ImageTable.jsx";
import VideoTable from "./views/VideoTable.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/upload",
    name: "Upload",
    icon: "pe-7s-cloud-upload",
    component: Upload,
    layout: "/admin"
  },
  {
    path: "/imagetable",
    name: "Image Table",
    icon: "pe-7s-note2",
    component: ImageTable,
    layout: "/admin"
  },
  {
    path: "/videotable",
    name: "Video Table",
    icon: "pe-7s-note2",
    component: VideoTable,
    layout: "/admin"
  }
];

export default dashboardRoutes;
