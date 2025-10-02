import { Link } from "react-router-dom";
import { ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";
import Breadcrumb from "../../components/breadcrumb";

const Product = () => {
  const menus = [
    {
      title: "Pending Verification",
      desc: "Items uploaded by sellers and awaiting admin verification.",
      icon: <ClipboardCheck className="h-8 w-8 mb-3 text-yellow-600" />,
      link: "/admin/product/pending",
    },
    {
      title: "Verified Items",
      desc: "List of items that have been verified for auction.",
      icon: <CheckCircle2 className="h-8 w-8 mb-3 text-green-600" />,
      link: "/admin/product/approved",
    },
    {
      title: "Rejected Items",
      desc: "Rejected items and reasons for rejection.",
      icon: <XCircle className="h-8 w-8 mb-3 text-red-600" />,
      link: "/admin/product/rejected",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <Breadcrumb paths={["Product"]} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menus.map((menu) => (
          <Link
            key={menu.title}
            to={menu.link}
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
          >
            {menu.icon}
            <h2 className="text-lg font-semibold mb-1">{menu.title}</h2>
            <p className="text-sm text-gray-600">{menu.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Product;
