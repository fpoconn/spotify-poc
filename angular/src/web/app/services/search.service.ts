import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";

@Injectable()
export class SearchService {

    constructor(private _http: Http, private _authService: AuthService) {}

    search(searchStr, type, limit) {

        let localLimit = limit ? limit : 30;
        let localType = type ? type : 'artist,track,album,playlist';

        if(searchStr) {
            return this._http.get('https://api.spotify.com/v1/search?type=' + localType + '&q=' + searchStr.trim().replace(' ', '+') + '&limit=' + localLimit)
                .map(res => res.json());
        }
    }

    searchRecommendations(searchModel){
        console.log("SERACH MODEL:");
        console.log(searchModel.includeAcousticness);

        let searchURL = "https://api.spotify.com/v1/recommendations";
        let hasParams = false;

        var access_token =  this._authService.getAccessToken();
        var headers = new Headers();

        if(access_token){

            headers.append('Authorization', 'Bearer '+ access_token);
        }
        else{
            console.log("NO ACCESS TOKEN");
            return;
        }

        if(searchModel.seedTrack && searchModel.seedArtist){
            searchURL = searchURL.concat('?seed_tracks=' + searchModel.seedTrack + '&seed_artists=' + searchModel.seedArtist);
            hasParams = true;
        }

        if(searchModel.includeAcousticness){
            let acousticness = (searchModel.acousticness / 100).toString();
            searchURL = hasParams ? searchURL.concat('&target_acousticness=' + acousticness) : searchURL.concat('?target_acousticness=' + acousticness);
            hasParams = true;
        }
        if(searchModel.includeCheerfulness){
            let cheerfulness = (searchModel.cheerfulness / 100).toString();
            searchURL = hasParams ? searchURL.concat('&target_valence=' + cheerfulness) : searchURL.concat('?target_valence=' + cheerfulness);
            hasParams = true;
        }
        if(searchModel.includeDanceability){
            let danceability = (searchModel.danceability / 100).toString();
            searchURL = hasParams ? searchURL.concat('&target_danceability=' + danceability) : searchURL.concat('?target_danceability=' + danceability);
            hasParams = true;
        }
        if(searchModel.includeLiveness){
            let liveness = (searchModel.liveness / 100).toString();
            searchURL = hasParams ? searchURL.concat('&target_liveness=' + liveness) : searchURL.concat('?target_liveness=' + liveness);
            hasParams = true;
        }

        if(hasParams) {
            console.log('search url: ' + searchURL);

            return this._http.get(searchURL,{headers: headers})
                .map(res => res.json());
        }
        
    }

}