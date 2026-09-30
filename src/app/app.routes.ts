import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/events-hub/events-hub.component').then(
        (m) => m.EventsHubComponent
      ),
  },

  // 1. IJF (Internship and Job Fair)
  {
    path: 'ijf',
    loadComponent: () =>
      import('./pages/events-website/ijf/ijf.component').then(
        (m) => m.IjfComponent
      ),
  },
  {
    path: 'ijf/studreg',
    loadComponent: () =>
      import('./pages/events-website/ijf/ijf-stud/ijf-stud.component').then(
        (m) => m.IjfStudComponent
      ),
  },
  {
    path: 'ijf/compreg',
    loadComponent: () =>
      import('./pages/events-website/ijf/ijf-comp/ijf-comp.component').then(
        (m) => m.IjfCompComponent
      ),
  },

  // 2. Entre-MUN
  {
    path: 'entremun',
    loadComponent: () =>
      import('./pages/events-website/entre-mun/entre-mun.component').then(
        (m) => m.EntreMunComponent
      ),
  },
  {
    path: 'entremun/reg',
    loadComponent: () =>
      import('./pages/events-website/entre-mun/mun-reg/mun-reg.component').then(
        (m) => m.MUNRegComponent
      ),
  },
  {
    path: 'entremun/dash',
    loadComponent: () =>
      import('./pages/events-website/entre-mun/mun-dash/mun-dash.component').then(
        (m) => m.MunDashComponent
      ),
  },

  // 3. iHack
  {
    path: 'ihack',
    loadComponent: () =>
      import('./pages/events-website/ihack/ihack.component').then(
        (m) => m.IhackComponent
      ),
  },
  {
    path: 'ihack/reg',
    loadComponent: () =>
      import('./pages/events-website/ihack/ihack-reg/ihack-reg.component').then(
        (m) => m.IhackRegComponent
      ),
  },

  // 4. Innovation & Startup Expo
  {
    path: 'expo',
    loadComponent: () =>
      import('./pages/events-website/expo/expo.component').then(
        (m) => m.ExpoComponent
      ),
  },
  {
    path: 'expo/query',
    loadComponent: () =>
      import('./pages/events-website/expo/expo-query/expo-query.component').then(
        (m) => m.ExpoQueryComponent
      ),
  },
  {
    path: 'expo/payments',
    loadComponent: () =>
      import('./pages/events-website/expo/expo-payments/expo-payments.component').then(
        (m) => m.ExpoPaymentsComponent
      ),
  },

  // 5. SeedStars
  {
    path: 'seedstars',
    loadComponent: () =>
      import('./pages/events-website/seed-stars/seed-stars.component').then(
        (m) => m.SeedStarsComponent
      ),
  },
  {
    path: 'seedstars/reg',
    loadComponent: () =>
      import(
        './pages/events-website/seed-stars/seed-stars-reg/seed-stars-reg.component'
      ).then((m) => m.SeedStarsRegComponent),
  },

  // 6. Influencer Summit
  {
    path: 'influencersummit',
    loadComponent: () =>
      import('./pages/events-website/influencer-summit/influencer-summit.component').then(
        (m) => m.InfluencerSummitComponent
      ),
  },

  // 7. International Summit (ISummit)
  {
    path: 'isummit',
    loadComponent: () =>
      import('./pages/events-website/isummit/isummit.component').then(
        (m) => m.IsummitComponent
      ),
  },
  {
    path: 'isummit/reg',
    loadComponent: () =>
      import('./pages/events-website/isummit/isummit-reg/isummit-reg.component').then(
        (m) => m.IsummitRegComponent
      ),
  },

  // 8. TTMM (Two Minutes To Market)
  {
    path: 'ttmm',
    loadComponent: () =>
      import('./pages/events-website/ttmm/ttmm.component').then(
        (m) => m.TtmmComponent
      ),
  },
  {
    path: 'ttmm/reg',
    loadComponent: () =>
      import('./pages/events-website/ttmm/ttmm-reg/ttmm-reg.component').then(
        (m) => m.TTMMRegComponent
      ),
  },

  // 9. Contingent Leader
  {
    path: 'cl',
    loadComponent: () =>
      import('./pages/events-website/cl/cl.component').then(
        (m) => m.CLComponent
      ),
  },
  {
    path: 'cl/dash',
    loadComponent: () =>
      import('./pages/events-website/cl/cl-dash/cl-dash.component').then(
        (m) => m.ClDashComponent
      ),
  },
  {
    path: 'contingent',
    loadComponent: () =>
      import('./pages/events-website/cl/cl.component').then(
        (m) => m.CLComponent
      ),
  },

  // 10. Competitions
  {
    path: 'compi',
    loadComponent: () =>
      import('./pages/events-website/compi/compi.component').then(
        (m) => m.CompiComponent
      ),
  },
  {
    path: 'compi/reg',
    loadComponent: () =>
      import('./pages/events-website/compi/compi-reg/compi-reg.component').then(
        (m) => m.CompiRegComponent
      ),
  },

  // 11. Workshops
  {
    path: 'workshops',
    loadComponent: () =>
      import('./pages/events-website/workshop/workshop.component').then(
        (m) => m.WorkshopComponent
      ),
  },
  {
    path: 'workshops/reg',
    loadComponent: () =>
      import(
        './pages/events-website/workshop/workshop-reg/workshop-reg.component'
      ).then((m) => m.WorkshopRegComponent),
  },

  // 12. GEC
  {
    path: 'gec',
    loadComponent: () =>
      import('./pages/events-website/gec/gec.component').then(
        (m) => m.GecComponent
      ),
  },
  {
    path: 'gec/reg',
    loadComponent: () =>
      import('./pages/events-website/gec/gec-reg/gec-reg.component').then(
        (m) => m.GecRegComponent
      ),
  },

  // 13. Virtual Stock Market (VSM)
  {
    path: 'vsm',
    loadComponent: () =>
      import('./pages/events-website/vsm/vsm.component').then(
        (m) => m.VsmComponent
      ),
  },
  {
    path: 'vsm/reg',
    loadComponent: () =>
      import('./pages/events-website/vsm/vsm-reg/vsm-reg.component').then(
        (m) => m.VsmRegComponent
      ),
  },

  // 14. Networking Arena (NA)
  {
    path: 'na',
    loadComponent: () =>
      import('./pages/events-website/na/na.component').then(
        (m) => m.NaComponent
      ),
  },
  {
    path: 'na/reg',
    loadComponent: () =>
      import('./pages/events-website/na/na-reg/na-reg.component').then(
        (m) => m.NaRegComponent
      ),
  },

  // Wildcard redirect to Home
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
