import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArtistService} from "../services/artist.service";
import {AlbumListComponent} from '../albums/albums-list.component';

@Component({
    selector: 'spot-related-albums',
    template: `
    <div *ngIf="artistId">
        <div *ngIf="relatedAlbums">
             <spot-album-list [albums]="relatedAlbums"></spot-album-list>
        </div>
        <div *ngIf="!relatedAlbums">
            Sorry, no Related Albums
        </div>
    </div>
    <div *ngIf="!artistId">
    No Artist Provided
    </div>
    `,
    providers: [ArtistService],
    directives: [AlbumListComponent]
})

export class RelatedAlbumsComponent {

    artistId: String;
    relatedAlbums: any;
    sub: any;

    constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _artistService: ArtistService) {

        this.sub = this._router.routerState.parent(this._activatedRoute).params.subscribe(params => {

            this.artistId = params['id'];

            if (this.artistId) {

                this._artistService.artistAlbums(this.artistId).subscribe(
                    res => {
                        this.relatedAlbums = res.items;
                    },
                    err => console.log("error: " + err),
                    () => console.log("Artist Tracks loaded.")
                );

            }

        });
    }

}