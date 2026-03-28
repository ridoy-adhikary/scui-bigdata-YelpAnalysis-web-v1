import React from "react";
import { Link } from "react-router-dom";
export interface FeaturedCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
}
const FeaturedCard: React.FC<FeaturedCardProps> = ({ title, description, imageUrl, url }) => {
  return (
    <Link to={url} className="block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow bg-white">
      {imageUrl && <div className="h-48 w-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-gray-950 mb-2">{title}</h3>
        <p className="font-body text-gray-600 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
};
export default FeaturedCard;
