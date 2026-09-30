import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface EventLink {
  title: string;
  tag: string;
  desc: string;
  route: string;
  sublinks?: { label: string; route: string }[];
  category: 'Flagship' | 'Competitions' | 'Summits' | 'Networking';
}

@Component({
  selector: 'app-events-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hub-container">
      <header class="hub-header">
        <div class="header-badge">E-Summit '26 Workspace</div>
        <h1>Events Website Portal</h1>
        <p>Independent developer environment for all E-Summit '26 event websites & registration portals.</p>
      </header>

      <div class="events-grid">
        <div *ngFor="let ev of events" class="event-card">
          <div class="card-top">
            <span class="category-pill" [attr.data-cat]="ev.category">{{ ev.category }}</span>
            <span class="tag-label">{{ ev.tag }}</span>
          </div>
          <h3>{{ ev.title }}</h3>
          <p>{{ ev.desc }}</p>
          <div class="actions">
            <a [routerLink]="ev.route" class="main-btn">Open Page &rarr;</a>
            <div class="sub-buttons" *ngIf="ev.sublinks?.length">
              <a *ngFor="let sub of ev.sublinks" [routerLink]="sub.route" class="sub-btn">
                {{ sub.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hub-container {
      min-height: 100vh;
      background: #0d0f17;
      color: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 40px 24px 80px;
    }
    .hub-header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 50px;
    }
    .header-badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(255, 107, 0, 0.15);
      border: 1px solid rgba(255, 107, 0, 0.4);
      color: #ff8c38;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }
    .hub-header h1 {
      font-size: 2.75rem;
      font-weight: 800;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #ffffff 40%, #ff8c38 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hub-header p {
      color: #94a3b8;
      font-size: 1.1rem;
      line-height: 1.6;
    }
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1300px;
      margin: 0 auto;
    }
    .event-card {
      background: #151926;
      border: 1px solid #232a3d;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .event-card:hover {
      transform: translateY(-4px);
      border-color: #ff6b00;
      box-shadow: 0 12px 30px rgba(255, 107, 0, 0.15);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .category-pill {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
    }
    .category-pill[data-cat="Flagship"] { background: rgba(255, 107, 0, 0.2); color: #ff9d54; }
    .category-pill[data-cat="Competitions"] { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .category-pill[data-cat="Summits"] { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .category-pill[data-cat="Networking"] { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
    .tag-label {
      font-size: 0.8rem;
      color: #64748b;
      font-family: monospace;
    }
    .event-card h3 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0 0 8px;
      color: #f8fafc;
    }
    .event-card p {
      font-size: 0.92rem;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 20px;
      flex-grow: 1;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .main-btn {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, #ff6b00, #ff8c38);
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 10px 16px;
      border-radius: 10px;
      transition: opacity 0.2s;
    }
    .main-btn:hover {
      opacity: 0.9;
    }
    .sub-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sub-btn {
      font-size: 0.82rem;
      color: #94a3b8;
      text-decoration: none;
      background: #1c2233;
      border: 1px solid #2d374d;
      padding: 5px 10px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .sub-btn:hover {
      color: #ff8c38;
      border-color: #ff8c38;
      background: #242c42;
    }
  `]
})
export class EventsHubComponent {
  events: EventLink[] = [
    {
      title: 'Internship & Job Fair (IJF)',
      tag: '/ijf',
      desc: 'Exclusive recruitment drive connecting students with top startups and companies.',
      route: '/ijf',
      category: 'Flagship',
      sublinks: [
        { label: 'Student Reg', route: '/ijf/studreg' },
        { label: 'Recruiter Reg', route: '/ijf/compreg' }
      ]
    },
    {
      title: 'Entre-MUN',
      tag: '/entremun',
      desc: 'Entrepreneurship Model United Nations conference committees and debate portal.',
      route: '/entremun',
      category: 'Flagship',
      sublinks: [
        { label: 'MUN Registration', route: '/entremun/reg' },
        { label: 'MUN Dashboard', route: '/entremun/dash' }
      ]
    },
    {
      title: 'iHack Hackathon',
      tag: '/ihack',
      desc: 'Annual hackathon bringing tech innovators together to solve real-world problems.',
      route: '/ihack',
      category: 'Competitions',
      sublinks: [
        { label: 'iHack Register', route: '/ihack/reg' }
      ]
    },
    {
      title: 'Innovation & Startup Expo',
      tag: '/expo',
      desc: 'Showcase of cutting-edge startups and breakthrough hardware/software products.',
      route: '/expo',
      category: 'Flagship',
      sublinks: [
        { label: 'Expo Register', route: '/expo/reg' },
        { label: 'Expo Dashboard', route: '/expo/dash' }
      ]
    },
    {
      title: 'SeedStars',
      tag: '/seedstars',
      desc: 'Pitching platform for early-stage startups to secure seed investments.',
      route: '/seedstars',
      category: 'Flagship',
      sublinks: [
        { label: 'SeedStars Register', route: '/seedstars/reg' }
      ]
    },
    {
      title: 'Influencer Summit',
      tag: '/influencersummit',
      desc: 'Gathering of top creators, marketers, and digital storytelling leaders.',
      route: '/influencersummit',
      category: 'Summits',
      sublinks: [
        { label: 'Nomination Form', route: '/influencersummit/nominate' }
      ]
    },
    {
      title: 'International Summit (ISummit)',
      tag: '/isummit',
      desc: 'Global entrepreneurship delegations, cross-border incubators, and summits.',
      route: '/isummit',
      category: 'Summits'
    },
    {
      title: 'Two Minutes To Market (TTMM)',
      tag: '/ttmm',
      desc: 'Speed-pitching competition in front of leading angel investors.',
      route: '/ttmm',
      category: 'Competitions',
      sublinks: [
        { label: 'TTMM Register', route: '/ttmm/reg' }
      ]
    },
    {
      title: 'Contingent Leader (CL)',
      tag: '/cl',
      desc: 'Institutional contingent leader program and delegation management.',
      route: '/cl',
      category: 'Networking',
      sublinks: [
        { label: 'CL Dashboard', route: '/cl/dash' },
        { label: 'Contingent Portal', route: '/contingent' }
      ]
    },
    {
      title: 'Competitions (Compi)',
      tag: '/compi',
      desc: 'Main competitions hub for case studies, business simulation, and challenges.',
      route: '/compi',
      category: 'Competitions',
      sublinks: [
        { label: 'Compi Register', route: '/compi/reg' }
      ]
    },
    {
      title: 'Workshops & Masterclasses',
      tag: '/workshops',
      desc: 'Hands-on practical workshops conducted by industry leaders and founders.',
      route: '/workshops',
      category: 'Networking'
    },
    {
      title: 'Global Entrepreneurship Congress (GEC)',
      tag: '/gec',
      desc: 'Keynote panels and conferences on the future of innovation.',
      route: '/gec',
      category: 'Summits',
      sublinks: [
        { label: 'GEC Register', route: '/gec/reg' }
      ]
    },
    {
      title: 'Virtual Stock Market (VSM)',
      tag: '/vsm',
      desc: 'Real-time mock trading and portfolio simulation game.',
      route: '/vsm',
      category: 'Competitions',
      sublinks: [
        { label: 'VSM Register', route: '/vsm/reg' }
      ]
    },
    {
      title: 'Networking Arena (NA)',
      tag: '/na',
      desc: 'Dedicated 1-on-1 networking portal between attendees, founders, and VCs.',
      route: '/na',
      category: 'Networking',
      sublinks: [
        { label: 'NA Register', route: '/na/reg' }
      ]
    }
  ];
}
