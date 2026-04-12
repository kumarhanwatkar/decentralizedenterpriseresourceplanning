import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/context/ThemeContext';

const ContactPage = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get in Touch
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Have questions about D-ERP? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: 'Email', value: 'contact@d-erp.com' },
            { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567' },
            { icon: MapPin, title: 'Location', value: 'San Francisco, CA' },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg border ${
                isDark
                  ? 'bg-blue-900/20 border-blue-500/30 hover:border-cyan-500/50'
                  : 'bg-white border-gray-200 hover:border-blue-400'
              } transition-all`}
            >
              <item.icon className={`w-8 h-8 mb-3 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className={`p-8 rounded-lg border ${
              isDark
                ? 'bg-blue-900/20 border-blue-500/30'
                : 'bg-white border-gray-200'
            }`}
          >
            {submitted && (
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-green-900/30 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                ✓ Thank you! We'll get back to you soon.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {[
                { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
              ].map((field) => (
                <div key={field.name}>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-2 rounded-lg border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-blue-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                className={`w-full px-4 py-2 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-slate-800 border-blue-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
                required
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={6}
                className={`w-full px-4 py-2 rounded-lg border transition-all resize-none ${
                  isDark
                    ? 'bg-slate-800 border-blue-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <Send size={20} /> Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
