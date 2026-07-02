import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AffiliationType, Goshuin, GoshuinFormat } from '../../../../openApi/goshuin';
import { APP_PATHS } from '../../../shared/models/app-paths.model';

@Component({
  selector: 'app-goshuin-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './goshuin-dashboard.component.html',
  styleUrl: './goshuin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinDashboardComponent {
  addPath = `/${APP_PATHS.GOSHUIN}/${APP_PATHS.GOSHUIN_DASHBOARD}/${APP_PATHS.GOSHUIN_DASHBOARD_ADD}`;

  goshuins = signal<Goshuin[]>([
    {
      id: '1',
      creator: { userId: 'user1' },
      format: GoshuinFormat.Written,
      temple: {
        longitude: 139.691706,
        latitude: 35.676217,
        id: 'temple1',
        affiliationType: AffiliationType.Shinto,
        translations: {
          en: {
            name: 'Meiji Jingu',
            region: 'Kanto',
            postalCode: '151-8557',
            prefecture: 'Tokyo',
            city: 'Shibuya',
            address: '1-1 Yoyogikamizonocho',
          }
        }
      },
      pages: 1,
      startDate: '2024-01-01',
      translations: {
        en: {
          description: 'First goshuin of the year'
        }
      },
      images: [{ url: 'https://images.unsplash.com/photo-1545567191-7b5085323056?q=80&w=1000&auto=format&fit=crop' }]
    },
    {
      id: '2',
      creator: { userId: 'user1' },
      format: GoshuinFormat.Paper,
      temple: {
        longitude: 139.691706,
        latitude: 35.676217,
        id: 'temple2',
        affiliationType: AffiliationType.Buddhist,
        translations: {
          en: {
            name: 'Senso-ji',
            region: 'Kanto',
            postalCode: '111-0032',
            prefecture: 'Tokyo',
            city: 'Taito',
            address: '2-3-1 Asakusa',
          }
        }
      },
      pages: 1,
      startDate: '2024-02-15',
      translations: {
        en: {
          description: 'Visit during winter'
        }
      },
      images: [{ url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop' }]
    },
    {
      id: '3',
      creator: { userId: 'user1' },
      format: GoshuinFormat.Cut,
      temple: {
        longitude: 139.691706,
        latitude: 35.676217,
        id: 'temple3',
        affiliationType: AffiliationType.Shinto,
        translations: {
          en: {
            name: 'Fushimi Inari-taisha',
            region: 'Kansai',
            postalCode: '612-0882',
            prefecture: 'Kyoto',
            city: 'Kyoto',
            address: '68 Fukakusa Yabunouchicho',
          }
        }
      },
      pages: 2,
      startDate: '2024-03-10',
      translations: {
        en: {
          description: 'Beautiful torii gates'
        }
      }
    }
  ]);

  getTempleName(goshuin: Goshuin): string {
    return goshuin.temple.translations['en']?.name || 'Unknown Temple';
  }

  getTempleLocation(goshuin: Goshuin): string {
    const t = goshuin.temple.translations['en'];
    if (!t) return 'Unknown Location';
    return `${t.city}, ${t.prefecture}`;
  }
}
