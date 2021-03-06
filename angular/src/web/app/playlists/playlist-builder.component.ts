import {Component, ElementRef, Renderer, ViewChild} from '@angular/core';
import {PlaylistService} from "../services/playlist.service";
import {UserService} from "../services/user.service";
import {TrackInfo} from "../builder/track-info.component";
import {DropDirective} from "../tools/drop-directive";

@Component({
    selector: 'spot-playlist-builder',
    template: `
    <div>
        <h3 style="padding-left: 30px;" class="smallTopMargin">Playlists</h3>
        <table style="width: 100%;">
         <tr *ngFor="let playlist of playlists" class="clickable" [class.selected]="playlist.id === selectedPlaylistId" (click)="selectPlaylist(playlist)">
            <td style="padding: 4px; padding-left: 35px; padding-right: 20px;">{{playlist.name}}</td>
         </tr>
        </table>
    </div>
    <div *ngIf="selectedPlaylist">
    
        <h3 class="smallTopMargin" style="margin-bottom: 5px;">{{selectedPlaylist.name}}</h3>
        {{selectedPlaylistTrackCount}} Tracks
        
         <div id="playlistDroppable" myDroppable (dropped)="processDrop($event)">
         
             <table style="table-layout: fixed; width: 100%">
                 <tr *ngFor="let playlisttrack of selectedPlaylistTracks">
                    <td class="includeRemove">
                        <track-info *ngIf="selectedTab != 'recommendations'" [track]="playlisttrack.track" ></track-info>
                        <track-info id="playlistDraggable" *ngIf="selectedTab == 'recommendations'" [track]="playlisttrack.track" [myDraggable]="playlisttrack.track" ></track-info>
                        <span class="glyphicon glyphicon-remove-circle removePlaylist" (click)="removeTrack(playlisttrack.track)"></span>
                    </td>
                 </tr>
            </table>
            
         </div>
    </div>
    
    <div *ngIf="!selectedPlaylist">
        <h5>Select Playlist to add tracks.</h5>
    </div>
    <div>
        <ul class="nav">
            <li class="spotnav" [class.active]="selectedTab == 'trackSearch'"><a routerLink="builderTracks" (click)="selectTab('trackSearch')">Track Search</a></li>
            <li class="spotnav" [class.active]="selectedTab == 'playlistSearch'"><a routerLink="builderPlaylists" (click)="selectTab('playlistSearch')">Scan Playlists</a></li>
            <li class="spotnav" [class.active]="selectedTab == 'recommendations'"><a routerLink="builderRecommendations" (click)="selectTab('recommendations')">Recommendations</a></li>
        </ul>
        <hr style="margin: 0px">
        <router-outlet></router-outlet> 
    </div>
    `,
    directives: [DropDirective]
})

export class PlaylistBuilderComponent  {

    selectedPlaylist: any;
    selectedPlaylistId: string = '';
    playlists: any;
    selectedTab: string = "trackSearch";
    selectedPlaylistTracks: any;
    selectedPlaylistTrackCount: number;
    
    
    constructor(private _playlistService: PlaylistService, private _userService: UserService,
                private el: ElementRef, private renderer: Renderer) {

        this._userService.myPlaylists().subscribe(
            res => {
                this.playlists = res.items;
            },
            err => console.log("error loading my playlists: " + err)
        );
    }
    
    selectTab(tabId){
        this.selectedTab = tabId;
    }

    selectPlaylist(playlist){
        
        this.selectedPlaylist = playlist;
        this.selectedPlaylistId = playlist.id;
        this.getPlaylistTracks();
        sessionStorage['builderSelectedPlaylist'] = JSON.stringify(this.selectedPlaylist);

    }
    
    getPlaylistTracks(){

        this._playlistService.getTracks(this.selectedPlaylist.tracks.href).subscribe(
            result => {
                this.selectedPlaylistTracks = result.items;
                this.selectedPlaylistTrackCount = this.selectedPlaylistTracks.length;
            }
        )
    }
    ngOnInit(){

        let storedPlaylist = sessionStorage['builderSelectedPlaylist'];
        if(storedPlaylist) {
            this.selectedPlaylist = JSON.parse(storedPlaylist);
            this.selectedPlaylistId = this.selectedPlaylist.id;
            this.getPlaylistTracks();
        }

    }

    processDrop(event){
        
        this._playlistService.addTrack(this.selectedPlaylist.id, this.selectedPlaylist.owner.id, event.uri).subscribe(
            result => {
                // reload the tracks
                this.getPlaylistTracks();
            }
            ,
            err => console.log("error: " + err),
            () => console.log("TRACK ADDED TO PLAYLIST")
        )    
    }

    removeTrack(track){

        let trackData = "{ \"tracks\": [{ \"uri\": \"" + track.uri + "\"}] }";

        this._playlistService.removeTrack(this.selectedPlaylist.id, this.selectedPlaylist.owner.id, trackData).subscribe(
            result => {
                // reload the tracks
                this.getPlaylistTracks();
            }
            ,
            err => console.log("error: " + err),
            () => console.log("TRACK REMOVED FROM PLAYLIST")
        )
    }
}