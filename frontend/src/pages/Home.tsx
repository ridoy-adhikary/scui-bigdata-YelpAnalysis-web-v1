import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, PieChart, Users, Globe, Sparkles, Map } from 'lucide-react';

const Home: React.FC = () => {
  const stats = [
    { label: 'Businesses', value: '150K+', icon: Globe, color: 'text-yelp-red' },
    { label: 'Reviews', value: '7M+', icon: BarChart3, color: 'text-primary-700' },
    { label: 'Users', value: '2M+', icon: Users, color: 'text-accent-teal' },
    { label: 'Cities', value: '1K+', icon: Map, color: 'text-accent-orange' },
  ];

  const features = [
    {
      title: 'Business Insights',
      desc: 'Explore the performance and distribution of thousands of merchants across different industries.',
      link: '/statistics/data-analysis/business-analysis',
      icon: BarChart3,
    },
    {
      title: 'User Behavior',
      desc: 'Analyze how users interact with the platform, from elite statuses to review contributions.',
      link: '/statistics/data-analysis/user-analysis',
      icon: Users,
    },
    {
      title: 'Weather Correlations',
      desc: 'Discover how environmental factors like weather impact consumer ratings and check-ins.',
      link: '/insights/data-enrichment/weather-mood',
      icon: PieChart,
    },
    {
      title: 'AI Recommendations',
      desc: 'Leverage our advanced recommendation engine to find your next favorite business or friend.',
      link: '/research-ai',
      icon: Sparkles,
    },
  ];

  return (
    <div className="bg-gray-100 text-primary-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-100 to-white py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yelp-red/10 text-yelp-red font-display font-semibold text-sm mb-6"
            >
              <Sparkles size={16} />
              <span>Unlocking Insights from Yelp Data</span>
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-primary-900 mb-6 leading-tight">
              Data-Driven Analytics for the <br />
              <span className="text-yelp-red">Modern Marketplace</span>
            </h1>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto mb-10 font-body">
              Explore a comprehensive database of businesses, reviews, and user interactions through interactive visualizations and AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/statistics/data-analysis/business-analysis" 
                className="w-full sm:w-auto px-8 py-4 bg-yelp-red text-white rounded-xl font-display font-bold text-lg hover:bg-yelp-red-dark transition-all hover:scale-105 shadow-lg shadow-yelp-red/20 flex items-center justify-center gap-2"
              >
                Explore Statistics <ArrowRight size={20} />
              </Link>
              <Link 
                to="/research-ai" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-primary-900 border-2 border-primary-300 rounded-xl font-display font-bold text-lg hover:border-yelp-red hover:text-yelp-red transition-all flex items-center justify-center gap-2"
              >
                Try Research AI
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-yelp-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 border-y border-primary-300 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`inline-flex p-3 rounded-2xl bg-primary-100 mb-4 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-display font-bold text-primary-900">{stat.value}</div>
                <div className="text-sm font-body text-primary-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
              Comprehensive Analysis Suite
            </h2>
            <p className="text-primary-700 max-w-2xl mx-auto font-body">
              Our platform provides multiple lenses through which to view Yelp data, from high-level summaries to granular correlations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Link 
                key={i} 
                to={feature.link}
                className="group bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-primary-200 hover:border-yelp-red/20"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-900 mb-6 group-hover:bg-yelp-red group-hover:text-white transition-colors">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-display font-bold text-primary-900 mb-3">{feature.title}</h3>
                <p className="text-primary-700 text-sm font-body leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2 text-yelp-red font-display font-bold text-sm">
                  Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-900 rounded-3xl p-12 lg:p-20 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Ready to dive deep into the <br /> data?
              </h2>
              <p className="text-primary-100 text-lg mb-10 font-body">
                Access the full suite of interactive charts, maps, and reports to uncover hidden patterns in the Yelp ecosystem.
              </p>
              <Link 
                to="/statistics/data-analysis/comprehensive-analysis" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-yelp-red text-white rounded-xl font-display font-bold text-lg hover:bg-yelp-red-dark transition-all shadow-xl"
              >
                View Comprehensive Report <ArrowRight size={20} />
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none hidden lg:block">
              <BarChart3 size={400} className="text-white" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;