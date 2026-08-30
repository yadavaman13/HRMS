# Public Layout Patterns Guide

**Practical code examples for building public website layouts in the Apex Template**

---

## Overview

This guide provides ready-to-use layout patterns for public-facing websites and consumer applications. Use these patterns for travel planners, e-commerce sites, landing pages, and any public web app.

---

## 1. PublicLayout Component

Base layout for all public pages with header and footer.

### File: `client/src/components/Layouts/PublicLayout.jsx`

```jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PublicLayout.scss';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### File: `client/src/components/Layouts/PublicLayout.scss`

```scss
@use '@/styles/variables' as v;

.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: v.$color-background;
}

.public-main {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
}
```

---

## 2. Header Component

Top navigation for public websites.

### File: `client/src/components/Layouts/Header.jsx`

```jsx
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/Shared/Buttons/Button/Button';
import './Header.scss';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="site-logo">
          <img src="/logo.svg" alt="GlobeTrotter" />
          <span className="logo-text">GlobeTrotter</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => (isActive ? 'active' : '')}>
            Features
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pricing
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            About
          </NavLink>
        </nav>

        {/* Auth Actions */}
        <div className="header-actions">
          <Button variant="ghost" to="/login" icon={<User size={18} />}>
            Login
          </Button>
          <Button variant="primary" to="/signup">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/features" onClick={() => setMobileMenuOpen(false)}>
            Features
          </NavLink>
          <NavLink to="/pricing" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>
          <div className="mobile-auth">
            <Button variant="ghost" to="/login" fullWidth>
              Login
            </Button>
            <Button variant="primary" to="/signup" fullWidth>
              Get Started
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
```

### File: `client/src/components/Layouts/Header.scss`

```scss
@use '@/styles/variables' as v;

.site-header {
  background-color: v.$color-surface;
  border-bottom: 1px solid v.$color-border;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: v.$shadow-small;
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: v.$spacing-md v.$spacing-xl;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: v.$spacing-xl;

  @include v.tablet {
    padding: v.$spacing-md v.$spacing-lg;
  }
}

.site-logo {
  display: flex;
  align-items: center;
  gap: v.$spacing-sm;
  text-decoration: none;
  font-size: v.$font-size-xl;
  font-weight: 700;
  color: v.$color-text-primary;

  img {
    height: 32px;
    width: auto;
  }
}

.desktop-nav {
  display: flex;
  gap: v.$spacing-xl;
  align-items: center;

  a {
    text-decoration: none;
    color: v.$color-text-secondary;
    font-weight: 500;
    padding: v.$spacing-sm v.$spacing-md;
    border-radius: v.$radius-medium;
    transition: all 0.2s ease;

    &:hover {
      color: v.$color-primary;
      background-color: v.$color-background;
    }

    &.active {
      color: v.$color-primary;
    }
  }

  @include v.tablet {
    display: none;
  }
}

.header-actions {
  display: flex;
  gap: v.$spacing-md;
  align-items: center;

  @include v.tablet {
    display: none;
  }
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: v.$color-text-primary;
  padding: v.$spacing-sm;

  @include v.tablet {
    display: block;
  }
}

.mobile-nav {
  display: none;
  flex-direction: column;
  gap: v.$spacing-sm;
  padding: v.$spacing-lg;
  border-top: 1px solid v.$color-border;

  @include v.tablet {
    display: flex;
  }

  a {
    text-decoration: none;
    color: v.$color-text-secondary;
    font-weight: 500;
    padding: v.$spacing-md;
    border-radius: v.$radius-medium;
    transition: all 0.2s ease;

    &:hover {
      color: v.$color-primary;
      background-color: v.$color-background;
    }

    &.active {
      color: v.$color-primary;
      background-color: v.$color-background;
    }
  }

  .mobile-auth {
    display: flex;
    flex-direction: column;
    gap: v.$spacing-sm;
    margin-top: v.$spacing-md;
    padding-top: v.$spacing-md;
    border-top: 1px solid v.$color-border;
  }
}
```

---

## 3. Footer Component

### File: `client/src/components/Layouts/Footer.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="footer-logo">GlobeTrotter</h3>
            <p className="footer-tagline">Empowering personalized travel planning</p>
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

### File: `client/src/components/Layouts/Footer.scss`

```scss
@use '@/styles/variables' as v;

.site-footer {
  background-color: v.$color-surface;
  border-top: 1px solid v.$color-border;
  margin-top: v.$spacing-8xl;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: v.$spacing-4xl v.$spacing-xl v.$spacing-xl;

  @include v.tablet {
    padding: v.$spacing-3xl v.$spacing-lg v.$spacing-lg;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: v.$spacing-3xl;
  margin-bottom: v.$spacing-3xl;

  @include v.tablet {
    grid-template-columns: 1fr 1fr;
    gap: v.$spacing-2xl;
  }

  @include v.mobile {
    grid-template-columns: 1fr;
    gap: v.$spacing-xl;
  }
}

.footer-brand {
  .footer-logo {
    font-size: v.$font-size-xl;
    font-weight: 700;
    margin-bottom: v.$spacing-md;
    color: v.$color-text-primary;
  }

  .footer-tagline {
    color: v.$color-text-secondary;
    margin-bottom: v.$spacing-lg;
    max-width: 300px;
  }
}

.footer-social {
  display: flex;
  gap: v.$spacing-md;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: v.$radius-medium;
    background-color: v.$color-background;
    color: v.$color-text-secondary;
    transition: all 0.2s ease;

    &:hover {
      background-color: v.$color-primary;
      color: white;
    }
  }
}

.footer-links {
  h4 {
    font-size: v.$font-size-base;
    font-weight: 600;
    margin-bottom: v.$spacing-md;
    color: v.$color-text-primary;
  }

  display: flex;
  flex-direction: column;
  gap: v.$spacing-sm;

  a {
    color: v.$color-text-secondary;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: v.$color-primary;
    }
  }
}

.footer-bottom {
  padding-top: v.$spacing-xl;
  border-top: 1px solid v.$color-border;
  text-align: center;
  color: v.$color-text-secondary;
  font-size: v.$font-size-sm;
}
```

---

## 4. Hero Section Pattern

### File: `client/src/components/Sections/HeroSection.jsx`

```jsx
import Button from '@/components/Shared/Buttons/Button/Button';
import { ArrowRight, Play } from 'lucide-react';
import './HeroSection.scss';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Plan Your Perfect <span className="highlight">Journey</span>
          </h1>
          <p className="hero-subtitle">
            Create personalized travel itineraries, discover amazing destinations, and share your
            adventures with the world.
          </p>
          <div className="hero-actions">
            <Button
              variant="primary"
              size="large"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              to="/signup"
            >
              Start Planning
            </Button>
            <Button variant="outline" size="large" icon={<Play size={20} />}>
              Watch Demo
            </Button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <strong>10,000+</strong>
              <span>Trips Created</span>
            </div>
            <div className="stat-item">
              <strong>150+</strong>
              <span>Countries</span>
            </div>
            <div className="stat-item">
              <strong>5,000+</strong>
              <span>Happy Travelers</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/images/hero-illustration.svg" alt="Travel planning illustration" />
        </div>
      </div>
    </section>
  );
}
```

### File: `client/src/components/Sections/HeroSection.scss`

```scss
@use '@/styles/variables' as v;

.hero-section {
  padding: v.$spacing-6xl v.$spacing-xl;
  background: linear-gradient(
    135deg,
    rgba(v.$color-primary, 0.05) 0%,
    rgba(v.$color-secondary, 0.05) 100%
  );

  @include v.tablet {
    padding: v.$spacing-4xl v.$spacing-lg;
  }
}

.hero-container {
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: v.$spacing-4xl;
  align-items: center;

  @include v.tablet {
    grid-template-columns: 1fr;
    gap: v.$spacing-3xl;
  }
}

.hero-content {
  .hero-title {
    font-size: v.$font-size-5xl;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: v.$spacing-lg;
    color: v.$color-text-primary;

    @include v.tablet {
      font-size: v.$font-size-4xl;
    }

    @include v.mobile {
      font-size: v.$font-size-3xl;
    }

    .highlight {
      background: linear-gradient(135deg, v.$color-primary, v.$color-secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .hero-subtitle {
    font-size: v.$font-size-xl;
    color: v.$color-text-secondary;
    margin-bottom: v.$spacing-2xl;
    max-width: 540px;
    line-height: 1.6;

    @include v.tablet {
      font-size: v.$font-size-lg;
    }
  }

  .hero-actions {
    display: flex;
    gap: v.$spacing-md;
    margin-bottom: v.$spacing-3xl;

    @include v.mobile {
      flex-direction: column;
    }
  }

  .hero-stats {
    display: flex;
    gap: v.$spacing-2xl;
    padding-top: v.$spacing-2xl;
    border-top: 1px solid v.$color-border;

    @include v.mobile {
      flex-direction: column;
      gap: v.$spacing-lg;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: v.$spacing-xs;

      strong {
        font-size: v.$font-size-2xl;
        font-weight: 700;
        color: v.$color-primary;
      }

      span {
        font-size: v.$font-size-sm;
        color: v.$color-text-secondary;
      }
    }
  }
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-width: 600px;
    height: auto;
  }

  @include v.tablet {
    order: -1;
  }
}
```

---

## 5. Features Grid Pattern

### File: `client/src/components/Sections/FeaturesGrid.jsx`

```jsx
import { Map, Calendar, Share2, DollarSign, Users, Globe } from 'lucide-react';
import './FeaturesGrid.scss';

const features = [
  {
    icon: <Map size={32} />,
    title: 'Interactive Itineraries',
    description: 'Build day-by-day travel plans with drag-and-drop simplicity',
  },
  {
    icon: <Calendar size={32} />,
    title: 'Smart Scheduling',
    description: 'Optimize your trip timeline with intelligent suggestions',
  },
  {
    icon: <DollarSign size={32} />,
    title: 'Budget Tracking',
    description: 'Stay within budget with real-time cost estimates',
  },
  {
    icon: <Share2 size={32} />,
    title: 'Easy Sharing',
    description: 'Share your itineraries with friends and family',
  },
  {
    icon: <Users size={32} />,
    title: 'Collaborative Planning',
    description: 'Plan trips together with your travel companions',
  },
  {
    icon: <Globe size={32} />,
    title: 'Global Coverage',
    description: 'Discover destinations across 150+ countries',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">Everything You Need to Plan</h2>
          <p className="section-subtitle">Powerful features to make travel planning effortless</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### File: `client/src/components/Sections/FeaturesGrid.scss`

```scss
@use '@/styles/variables' as v;

.features-section {
  padding: v.$spacing-6xl v.$spacing-xl;

  @include v.tablet {
    padding: v.$spacing-4xl v.$spacing-lg;
  }
}

.features-container {
  max-width: 1440px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: v.$spacing-4xl;

  .section-title {
    font-size: v.$font-size-4xl;
    font-weight: 700;
    margin-bottom: v.$spacing-md;
    color: v.$color-text-primary;

    @include v.tablet {
      font-size: v.$font-size-3xl;
    }
  }

  .section-subtitle {
    font-size: v.$font-size-lg;
    color: v.$color-text-secondary;
    max-width: 600px;
    margin: 0 auto;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: v.$spacing-2xl;

  @include v.mobile {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background-color: v.$color-surface;
  border: 1px solid v.$color-border;
  border-radius: v.$radius-large;
  padding: v.$spacing-2xl;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: v.$shadow-large;
    border-color: v.$color-primary;
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: v.$radius-medium;
    background: linear-gradient(135deg, rgba(v.$color-primary, 0.1), rgba(v.$color-secondary, 0.1));
    color: v.$color-primary;
    margin-bottom: v.$spacing-lg;
  }

  .feature-title {
    font-size: v.$font-size-xl;
    font-weight: 600;
    margin-bottom: v.$spacing-sm;
    color: v.$color-text-primary;
  }

  .feature-description {
    color: v.$color-text-secondary;
    line-height: 1.6;
  }
}
```

---

## 6. Usage in Routes

### File: `client/src/router.jsx`

```jsx
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '@/components/Layouts/PublicLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/Auth/LoginPage';
import SignupPage from '@/pages/Auth/SignupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'features',
        element: <FeaturesPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
    ],
  },
]);

export default router;
```

---

## Quick Reference

### When to Use Each Pattern

| Pattern        | Use For                                       |
| -------------- | --------------------------------------------- |
| `PublicLayout` | All public pages (landing, features, pricing) |
| `Header`       | Top navigation on all public pages            |
| `Footer`       | Bottom section on all public pages            |
| `HeroSection`  | Landing page main section                     |
| `FeaturesGrid` | Feature showcases, benefits sections          |

### Key Principles

1. **No Sidebar** - Public websites use top navigation only
2. **Full-Width** - Content spans the full viewport (with max-width containers)
3. **Card-Based** - Use card grids instead of data tables
4. **Mobile-First** - Responsive design with mobile breakpoints
5. **SEO-Friendly** - Semantic HTML and proper meta tags

---

**Next Steps:** Check `WEBSITE_CONTEXT.md` for comprehensive guidance on building public web applications.
