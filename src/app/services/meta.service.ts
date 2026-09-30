import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PageMetaInfo } from '@constants/meta-info';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly selfUrl = environment.SELF_URL;
  private readonly defaultTitle = PageMetaInfo['default'].title;
  private readonly defaultImage = PageMetaInfo['default'].image!;
  private readonly defaultKeywords = PageMetaInfo['default'].keywords!;

  constructor(private meta: Meta, private titleService: Title) {}

  updateMetaTags(url: string) {
    const metaInfo = PageMetaInfo[url] || PageMetaInfo['default'];
    const { title, description, shortDescription, image, keywords } = metaInfo;

    const fullTitle = (url !== 'default' && PageMetaInfo[url])
      ? `${title} | ${this.defaultTitle}`
      : this.defaultTitle;

    const fullKeywords = PageMetaInfo[url]
      ? `${keywords}, ${this.defaultKeywords}`
      : this.defaultKeywords;

    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: fullKeywords });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({
      property: 'og:description',
      content: shortDescription || description,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: image || this.defaultImage,
    });
    this.meta.updateTag({
      property: 'og:url',
      content: `${this.selfUrl}/${url}`,
    });
  }
}
