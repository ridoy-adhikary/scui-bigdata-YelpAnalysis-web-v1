import React from "react";
import { Link } from "react-router-dom";
export interface TopicCardProps {
  title: string;
  icon?: React.ReactNode;
  url: string;
}
const TopicCard: React.FC<TopicCardProps> = ({ title, icon, url }) => {
  return (
    <Link to={url} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors border border-transparent hover:border-primary-200">
      {icon && <span className="text-primary-500">{icon}</span>}
      <span className="font-display font-medium text-gray-900">{title}</span>
    </Link>
  );
};
export default TopicCard;
