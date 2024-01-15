import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';
import { Component, NgModule, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MfeLoaderService } from 'src/app/services/mfe-loader.service';

@Component({
  selector: 'app-mfe-loader',
  templateUrl: './mfe-loader.component.html',
  styleUrls: ['./mfe-loader.component.scss']
})
export class MfeLoaderComponent implements OnInit {

  constructor(private mfeLoaderService: MfeLoaderService) { }
  title = 'Base';
  mfeData: any;
  mfeData2: any;
  mfeModule: any;
  mfeModule2: any;
  dynamicComponentInstance: any;
  dynamicComponentInstance2: any;

  public wordCardDecks = [
    {
      wordCardDeckName: 'Word Card Deck 1',
      wordCardList: [
        { name: 'Word Card 1.1' },
        { name: 'Word Card 1.2' },
      ],
    },
    {
      wordCardDeckName: 'Word Card Deck 2',
      wordCardList: [
        { name: 'Word Card 2.1' },
        { name: 'Word Card 2.2' },
      ],
    },
  ];
  
  public flashCardDecks = [
    {
      flashCardDeckName: 'Flash Card Deck 1',
      flashCardList: [
        { name: 'Flash Card 1.1' },
        { name: 'Flash Card 1.2' },
      ],
    },
    {
      flashCardDeckName: 'Flash Card Deck 2',
      flashCardList: [
        { name: 'Flash Card 2.1' },
        { name: 'Flash Card 2.2' },
      ],
    },
  ];
  
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: false }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild('dynamicComponentContainer2', { read: ViewContainerRef, static: false }) dynamicComponentContainer2!: ViewContainerRef;

  public wordCardModuleOptions: LoadRemoteModuleOptions = {
    type: 'module',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './WordCardDeckComp'
  };

  public flashCardModuleOptions: LoadRemoteModuleOptions = {
    type: 'module',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './FlashCardDeckComp'
  };

  ngOnInit(): void {
    this.loadMFE().then(()=> {
      console.log('Loading MFE complete')
    })
  }

  async loadMFE() {
    this.mfeModule = await this.mfeLoaderService.loadMfeModule(this.wordCardModuleOptions);
    console.log(this.mfeModule);

    this.mfeModule2 = await this.mfeLoaderService.loadMfeModule(this.flashCardModuleOptions);
    console.log(this.mfeModule2);
    
    if(!this.dynamicComponentContainer || !this.dynamicComponentContainer2)
      return;

    console.log('loadMFE - create component in container');
    this.renderDynamicComponent(this.mfeModule.WordCardDeckComponent, this.dynamicComponentContainer, this.dynamicComponentInstance, this.wordCardDecks, this.fromMfe.bind(this));
      this.renderDynamicComponent(this.mfeModule2.FlashCardDeckComponent, this.dynamicComponentContainer2, this.dynamicComponentInstance2, this.flashCardDecks, this.fromMfe2.bind(this));
  }

  private renderDynamicComponent(componentType: Type<any>, container: ViewContainerRef, dynamicComponentInstance: any, data: any[], callback: (data: string) => void) {
    if (!container || !componentType) {
      return;
    }

    container.clear();
    const componentRef = container.createComponent(componentType);
    dynamicComponentInstance = componentRef.instance;
    dynamicComponentInstance.parentData = { message: `Hello MFE from Host`, deckData: data };
    dynamicComponentInstance.callFromParent('Parent calling...');
    dynamicComponentInstance.setCB(callback);
    dynamicComponentInstance.newItemEvent?.subscribe((data: any) => {
      console.log('Output event emitted:', data);
    });
  }

  fromMfe (data: string){
    this.mfeData = data;
  }
  
  fromMfe2 (data: string){
    this.mfeData2 = data;
  }

}
