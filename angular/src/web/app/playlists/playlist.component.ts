import {Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';
import {PlaylistService} from "../services/playlist.service";

@Component({
    selector: 'spot-playlist',
    template: `
    <div *ngIf="playlist">
        <div>
            <h1>{{playlist.name}}</h1>  
               <h4>  {{playlist.tracks.total}} tracks </h4>
               <hr style="margin: 0px;">
        </div>
    </div>
    <div *ngIf="tracks">
        <table>
         <tr *ngFor="let track of tracks">
            <td width="35px"><header>{{track.track.track_number}}.</header></td>
            <td><iframe width="500" height="80" [src]="track.track.id | sanitizeTrackUrl" 
                frameborder="0" allowtransparency="true"></iframe></td>
         </tr>
        </table>
    </div>
    `,
    providers: [PlaylistComponent]
})

export class PlaylistComponent implements OnInit {

    playlist: any;
    tracks: any;

    constructor(private _activatedRoute: ActivatedRoute,
                private _router: Router,
                private _playlistService: PlaylistService) {
    }


    ngOnInit() {
        // revert to this if the subscribe code breaks
        // this.artist = this._activatedRoute.snapshot.data['artistResolve'];
        this._activatedRoute.data.subscribe( data => {
            
            this.playlist = data.playlistResolve;
            
            this._playlistService.getTracks(this.playlist.tracks.href).subscribe(

                result => {
                    this.tracks = result.items;
                }
            )
        });

    }


    showArtist(id){

        this._router.navigate(['../home/artist', id]);

    }

    showAlbum(id){
        this._router.navigate(['../home/album', id]);

    }


}