import { createBrowserRouter } from "react-router";

import Products from "@/pages/Products";
import Invoices from "@/pages/Invoices";
import AddProduct from "@/pages/AddProduct";
import AddInvoice from "@/pages/AddInvoice";
import PanelLayout from "@/components/PanelLayout";
import SingleInvoice from "@/pages/SingleInvoice";
import SingleProduct from "@/pages/SingleProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PanelLayout />,
    children: [
      {
        index: true,
        element: <Products />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <SingleProduct />,
      },
      {
        path: "invoices",
        element: <Invoices />,
      },
      {
        path: "invoices/:id",
        element: <SingleInvoice />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "add-invoice",
        element: <AddInvoice />,
      },
    ],
  },
]);

export default router;
