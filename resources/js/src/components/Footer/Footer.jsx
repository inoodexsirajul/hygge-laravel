import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useGetFooterQuery } from "../../redux/services/eCommerceApi";

const Footer = () => {
    const { data, isLoading, error } = useGetFooterQuery();

    if (isLoading) {
        return <div className="text-center py-4">Loading footer...</div>;
    }

    if (error || !data) {
        return (
            <div className="text-center py-4 text-red-500">
                Failed to load footer information.
            </div>
        );
    }

    const { footer_info, footer_social, footer_create_page } = data;

    // Group footer_create_page by 'page_for'
    const groupedPages = footer_create_page.reduce((acc, page) => {
        const category = page.page_for;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(page);
        return acc;
    }, {});

    const categoryNames = {
        f_about: "About",
        f_h_s: "Help & Support",
        f_l: "Legal",
    };

    const getSocialIcon = (icon) => {
        switch (icon) {
            case "fab fa-facebook-f":
                return <FaFacebookF />;
            case "fab fa-instagram":
                return <FaInstagram />;
            case "fab fa-twitter":
                return <FaTwitter />;
            default:
                return null;
        }
    };

    return (
        <footer className="bg-dark1 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        {footer_info.logo && (
                            <img
                                src={footer_info.logo}
                                alt="Hygge Logo"
                                className="mb-4 max-w-xs"
                            />
                        )}
                        <p className="mb-2">{footer_info.address}</p>
                        <p className="mb-2">Phone: {footer_info.phone}</p>
                        <p className="mb-2">Email: {footer_info.email}</p>
                    </div>

                    {Object.keys(groupedPages).map((category) => (
                        <div key={category}>
                            <h3 className="text-lg font-bold mb-4">
                                {categoryNames[category] || category}
                            </h3>
                            <ul>
                                {groupedPages[category]
                                    .sort((a, b) => a.serial_no - b.serial_no) // Safe to sort since groupedPages creates a new array
                                    .map((page) => (
                                        <li key={page.slug} className="mb-2">
                                            <Link
                                                to={`/${page.slug}`}
                                                className="hover:underline"
                                            >
                                                {page.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            {[...footer_social] // Create a copy of footer_social to avoid mutating the original
                                .sort((a, b) => a.serial_no - b.serial_no) // Sort the copied array
                                .map((social) => (
                                    <a
                                        key={social.serial_no}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-300"
                                        aria-label={social.name}
                                    >
                                        {getSocialIcon(social.icon)}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center border-t border-gray-600 pt-4">
                    <p>{footer_info.copyright}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
