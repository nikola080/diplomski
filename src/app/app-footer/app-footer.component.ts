import { Component, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.css']
})
export class AppFooterComponent implements AfterViewInit {
  showFooter: boolean = false;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.checkScroll();
    this.setupMutationObserver();
  }

  private checkScroll(): void {
    const windowHeight = window.innerHeight;
    const body = document.body;
    const html = document.documentElement;
    const documentHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
    
    const scrollPosition = window.scrollY || window.pageYOffset || html.scrollTop || body.scrollTop;

    this.showFooter = scrollPosition + windowHeight >= documentHeight;
    
    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  private setupMutationObserver(): void {
    const targetNode = this.el.nativeElement.closest('.content-container'); // Adjust the selector based on your structure

    if (!targetNode) {
      return;
    }

    const observer = new MutationObserver(() => {
      this.checkScroll();
    });

    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);
  }

  contactInformation = {
    address: 'Ulica Tome Zivanovica 23',
    phone: '+381 69 571 20 80',
    email: 'nidza.milosav@gmail.com'
  };
}