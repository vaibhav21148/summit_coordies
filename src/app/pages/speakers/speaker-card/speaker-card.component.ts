import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speaker-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speaker-card.component.html',
  styleUrl: './speaker-card.component.scss'
})
export class SpeakerCardComponent {
  @Input() speaker: any;

  readonly defaultPlaceholder = 'https://2k21.s3.amazonaws.com/images/Firefly_RemoveBackground.png';

  readonly colorSpeakersMap: Record<string, string> = {
    'travis kalanick': 'https://2k21.s3.amazonaws.com/images/Travis_Kalanick.jpeg',
    'aman gupta': 'https://2k21.s3.amazonaws.com/images/Aman-Gupta.jpg',
    'nitin gadkari': 'https://2k21.s3.amazonaws.com/images/Nitin_gadkari.jpg',
    'rajat sharma': 'https://2k21.s3.amazonaws.com/images/Rajat_Sharma.jpg',
    'anupam mittal': 'https://2k21.s3.amazonaws.com/images/anupammittal.jpg',
    'bhavish aggarwal': 'https://2k21.s3.amazonaws.com/images/Bhavish_Aggarwal.jpeg',
    'kunal shah': 'https://2k21.s3.amazonaws.com/images/Kunal_shah.png',
    'anupam kher': 'https://2k21.s3.amazonaws.com/images/Anupam_Kher.jpg',
    'werner vogels': 'https://2k21.s3.amazonaws.com/images/Werner_Vogels.jpg',
    'benedetto vigna': 'https://2k21.s3.amazonaws.com/images/Benedetto_Vigna.jpg',
    'nandan nilekani': 'https://2k21.s3.amazonaws.com/images/-nandan-nilekani.jpg',
    'smriti irani': 'https://2k21.s3.amazonaws.com/images/smriti_irani.jpg',
    'gaurav chaudhary': 'https://2k21.s3.amazonaws.com/images/technical-guruji.jpg',
    'nischay malhan': 'https://2k21.s3.amazonaws.com/images/nischay-malhanjpg.jpg',
    'sachin bansal': 'https://2k21.s3.amazonaws.com/images/Sachin_Bansal.jpeg',
    'scott marcar': 'https://2k21.s3.amazonaws.com/images/Scott_Marcar.jpg',
    'amitabh kant': 'https://2k21.s3.amazonaws.com/images/Amitabh_Kant.jpeg',
    'arundhati bhattacharya': 'https://2k21.s3.amazonaws.com/images/Arundhati_Bhattacharya.jpg',
    'anurag kashyap': 'https://2k21.s3.amazonaws.com/images/Anurag_Kashyap.jpg'
  };

  getImageUrl(speaker: any): string {
    if (!speaker) return this.defaultPlaceholder;

    const nameKey = (speaker.name || '').trim().toLowerCase();
    if (nameKey && this.colorSpeakersMap[nameKey]) {
      return this.colorSpeakersMap[nameKey];
    }

    let img = speaker.image || speaker.img || speaker.profile || speaker.img_url || speaker.photo || speaker.pic;
    if (!img || typeof img !== 'string') return this.defaultPlaceholder;

    img = img.trim();
    if (!img) return this.defaultPlaceholder;

    // Fix mixed-content on HTTPS production (e.g. ecell.in)
    if (img.startsWith('http://')) {
      img = 'https://' + img.substring(7);
    } else if (img.startsWith('//')) {
      img = 'https:' + img;
    } else if (img.startsWith('/media/') || img.startsWith('media/')) {
      const cleanPath = img.startsWith('/') ? img : '/' + img;
      img = 'https://apiserver.ecell.in' + cleanPath;
    }

    return img;
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.defaultPlaceholder) {
      target.src = this.defaultPlaceholder;
    }
  }
}
