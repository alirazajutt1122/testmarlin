import {Component} from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import { AppState } from './app.service';
import { CommissionSlabDetail } from './models/commission-slab-detail';
wjcCore.setLicenseKey('192.168.36.141|202.59.76.218|192.168.36.45|192.168.36.186|192.168.36.242|192.168.36.126|40.67.224.72|go.marlinpro.com|psx.marlinpro.com|192.168.36.82|192.168.36.245|192.168.36.117|192.168.36.121|192.168.36.222|192.168.36.51|192.168.36.15|192.168.36.105|192.168.36.10,932953992636939#B0nSW48iNz8CO6EjLykTMsgTMy8iN78SO58iMwIDLxQTMuYzMugjNx8iM9EjI0IyctRkIsICajVGdvZmbJJiOiEmTDJCLikzM9YzM6ITO9MTN9IzM9IiOiQWSiwSfdtlOicGbmJCLiEjdyIDMyIiOiIXZ6JCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TP7RVQ0tUalhXbw86VDpkQDl4KFdWUCF4RhdzT4U7TUlkSqNDSys6TKh5YORlcyxkYaN5dOF5a7UEdPhDcup7Lp9EamRGeroFUFZWdlpXcrhncF3iTBV5Vht6UzIHRoR7blJlMZhUQ4l7T9ljN0ZzTGRmdnRlZmN6VxpmMzNHRBZ5ZvN6QlZVcrQEcrgnUCV7MNVnSSJlezYHOXN7K5NWVS5Ue5dXSmZ7N7hXVr44bFhFStR7Z9MFNp3CaSR4a6FGdGtyYJp6LkdFMEFVM5RUey3mc72kR8JWQLx6dGJlco5kbv84dqZXOMZDbxhDcqVlcl5EZSVWb5oUTyM5ULh5YillYCN6M5N5KzAjSolnY7cmcx84cuZnauVFVr5EalRjSBR6NxZmNvYnQtdTYEpXOuZmZT3UStx6ZHp5LXN7cNlmdUV5KKxkR0x4UY9mcwZ7Q6Z6TqlVZiojITJCLiQTN7YDNzM4MiojIIJCLwIjM4ADNzADO0IicfJye&Qf35VfikEMyIlI0IyQiwiIu3Waz9WZ4hXRgACdlVGaThXZsZEIv5mapdlI0IiTisHL3JSNJ9UUiojIDJCLi86bpNnblRHeFBCIyV6dllmV4J7bwVmUg2Wbql6ViojIOJyes4nILdDOIJiOiMkIsIibvl6cuVGd8VEIgc7bSlGdsVXTg2Wbql6ViojIOJyes4nI4YkNEJiOiMkIsIibvl6cuVGd8VEIgAVQM3EIg2Wbql6ViojIOJyes4nIzMEMCJiOiMkIsISZy36Qg2Wbql6ViojIOJyes4nIVhzNBJiOiMkIsIibvl6cuVGd8VEIgQnchh6QsFWaj9WYulmRg2Wbql6ViojIOJyebpjIkJHUiwiIxUzMwgDMgEDMyEjMyAjMiojI4J7QiwiIwEjL6MjL8YTMuITOxwSNwEjL6MjL8YTMuITOxwSNx8iNz8CO6EjLykTMsETNuYzMugjNx8iM9EDLyIjMuYzMugjNx8iM9EDLxITMuYzMugjNx8iM9EDL7ETMuYzMugjNx8iM9EDL5QjMuYzMugjNx8iM9EDLygjL6MjL8YTMuITOxwSbvNmLvJHculGbyFWbug7cwxSbvNmLvJHculGbyFWbu26ZsIzNuQjMy8yN68CM4wiNyEjL6MjL8YTMuITOxwiM4IjL6MjL8YTMuITOxwiN8EjL6MjL8YTMuoTix');


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],

})
export class AppComponent {
    constructor(public appState: AppState,) {



    }




}
