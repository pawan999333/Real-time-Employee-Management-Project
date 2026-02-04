import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

interface PageSeoConfig {
  [key: string]: SeoConfig;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly siteName = 'StaffUnity';
  private readonly defaultImage = 'https://staffunity.netlify.app/assets/StaffUnity.png';
  private readonly baseUrl = 'https://staffunity.netlify.app';

  // Predefined SEO configurations for all pages
  private readonly pageConfigs: PageSeoConfig = {
    'dashboard': {
      title: 'Dashboard - StaffUnity',
      description: 'Access your StaffUnity dashboard to manage attendance, track leaves, view department stats, and monitor workforce metrics. Free HR dashboard for businesses.',
      keywords: 'StaffUnity, employee dashboard, HR dashboard, attendance management, leave tracking, department overview, workforce analytics, free HR software dashboard',
      url: '/pages/dashboard'
    },
    'employees': {
      title: 'Employee Directory - StaffUnity',
      description: 'Manage your complete employee directory with StaffUnity. Add, edit, view employee profiles, departments, and export employee data to Excel.',
      keywords: 'StaffUnity, employee directory, staff management, employee database, employee profiles, HR employee management, employee list software, staff directory',
      url: '/pages/employees'
    },
    'attendance': {
      title: 'Attendance Tracker - StaffUnity',
      description: 'Track employee attendance with StaffUnity. One-click check-in, attendance reports, Excel export. Best attendance tracker for 2025.',
      keywords: 'StaffUnity, attendance tracker, employee attendance system, attendance management software, daily attendance, attendance report, free attendance tracker, clock in clock out',
      url: '/pages/attendance'
    },
    'leaves': {
      title: 'Leave Management System - StaffUnity',
      description: 'Manage employee leave requests, approve PTO, track vacation days with StaffUnity. Streamline your HR leave approval workflow.',
      keywords: 'StaffUnity, leave management system, PTO tracker, time off management, vacation tracker, leave approval software, employee leave tracker, sick leave management, free PTO software',
      url: '/pages/leaves'
    },
    'departments': {
      title: 'Department Management - StaffUnity',
      description: 'Organize your company departments with StaffUnity. Create, manage, and track department-wise employee distribution. Free department management tool.',
      keywords: 'StaffUnity, department management, organizational structure, team organization, department software, company departments, HR department management',
      url: '/pages/departments'
    },
    'salery': {
      title: 'Salary Slip Generator - StaffUnity',
      description: 'Generate professional salary slips and calculate payroll with StaffUnity. Download salary slips as PDF. Free payroll management for small businesses.',
      keywords: 'StaffUnity, salary slip generator, payroll calculator, salary management, pay slip PDF, payroll software free, salary calculator, employee payroll, wage slip generator',
      url: '/pages/salery'
    },
    'chat': {
      title: 'Team Chat & Video Meetings - StaffUnity',
      description: 'Unified communication with StaffUnity. Real-time chat, video calls, and screen sharing. Connect with your team instantly.',
      keywords: 'StaffUnity, team chat, video calling, screen sharing, online meetings, employee communication, workplace messaging, internal chat, video conference, office communication tool',
      url: '/pages/chat'
    },
    'login': {
      title: 'Login - StaffUnity Portal',
      description: 'Login to StaffUnity employee portal. Access your attendance, leave requests, salary slips, and team chat. Secure employee login.',
      keywords: 'StaffUnity login, employee portal login, HR system login, staff login, employee login page, workforce management login',
      url: '/login'
    }
  };

  constructor(
    private meta: Meta,
    private titleService: Title
  ) {}

  /**
   * Get predefined SEO config for a specific page
   */
  getPageConfig(pageName: string): SeoConfig | null {
    return this.pageConfigs[pageName] || null;
  }

  /**
   * Update meta tags for the current page
   * Call this method in ngOnInit of components that need custom SEO
   */
  updateMetaTags(config: SeoConfig): void {
    // Update title
    const fullTitle = config.title 
      ? `${config.title} | ${this.siteName}` 
      : this.siteName;
    this.titleService.setTitle(fullTitle);

    // Update description
    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    // Update keywords
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Update URL
    const pageUrl = config.url ? `${this.baseUrl}${config.url}` : this.baseUrl;
    this.meta.updateTag({ property: 'og:url', content: pageUrl });

    // Update image
    const imageUrl = config.image || this.defaultImage;
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // Update OG title
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
  }

  /**
   * Apply SEO for a specific page using predefined configs
   */
  applyPageSeo(pageName: string): void {
    const config = this.getPageConfig(pageName);
    if (config) {
      this.updateMetaTags(config);
      this.setCanonicalUrl(config.url || '/');
    }
  }

  /**
   * Set default meta tags (call this on app initialization or route changes)
   */
  setDefaultTags(): void {
    this.updateMetaTags({
      title: 'StaffUnity - Free Employee Management System with Video Calling 2025',
      description: 'StaffUnity - Free all-in-one employee management. Features: Video Calling, Screen Sharing, Attendance, Leaves, Salary Slips & Chat. Best free HR software.',
      keywords: 'StaffUnity, video calling app, screen sharing for business, employee management system, free HR software, attendance tracking, leave management, employee portal, team video chat, online meetings, free employee management'
    });
  }

  /**
   * Set robots meta tag
   */
  setRobotsMeta(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  /**
   * Add canonical link dynamically
   */
  setCanonicalUrl(url: string): void {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', fullUrl);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', fullUrl);
      document.head.appendChild(link);
    }
  }
}
