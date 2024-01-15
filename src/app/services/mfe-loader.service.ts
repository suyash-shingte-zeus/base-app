import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MfeLoaderService {

  constructor() { }

  private loadedModules: { [key: string]: any } = {};

  async loadMfeModule(options: LoadRemoteModuleOptions): Promise<any> {
    const moduleName = options.exposedModule;

    if (this.loadedModules[moduleName]) {
      return this.loadedModules[moduleName];
    }

    try {
      const module = await loadRemoteModule(options);
      this.loadedModules[moduleName] = module;
      return module;
    } catch (error) {
      console.error('Error loading remote module:', error);
      throw error;
    }
  }
}
