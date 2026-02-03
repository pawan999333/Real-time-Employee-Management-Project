
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var JitsiMeetExternalAPI: any;

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit, AfterViewInit, OnDestroy {
  
  domain: string = 'meet.guifi.net';
  room: any;
  options: any;
  api: any;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Get user info if available (mocking or retrieving from storage)
    this.user = {
      name: 'Employee User' 
    }
    
    const storedUser = localStorage.getItem('user');
    if(storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            if(parsed.name) this.user.name = parsed.name;
        } catch(e) {}
    }
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['room']) {
        this.room = params['room'];
      } else {
        this.room = 'active-meeting-' + (new Date()).getTime();
        // Update URL without reloading
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { room: this.room },
          queryParamsHandling: 'merge'
        });
      }

      // Initialize Jitsi only after room is set and view is initialized
      this.initializeJitsi();
    });
  }

  initializeJitsi() {
    // Dipose existing if any prevents duplicates
    if (this.api) {
      this.api.dispose();
    }

    this.options = {
      roomName: this.room,
      width: '100%',
      height: '100%',
      configOverwrite: { 
        prejoinPageEnabled: false,
        toolbarButtons: [
          'camera', 
          'chat', 
          'desktop', // Screen sharing
          'microphone', 
          'hangup', 
          'participants-pane', 
          'tileview', 
          'videoquality', 
          'filmstrip', 
          'invite', 
          'select-background', 
          'raisehand', 
          'settings'
        ]
      },
      interfaceConfigOverwrite: {
        // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.user.name
      }
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    // Event handlers
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });
  }
  
  handleClose = () => {
    console.log("handleClose");
  }

  handleParticipantLeft = async (participant: any) => {
    console.log("handleParticipantLeft", participant);
  }

  handleParticipantJoined = async (participant: any) => {
    console.log("handleParticipantJoined", participant);
  }

  handleVideoConferenceJoined = async (participant: any) => {
    console.log("handleVideoConferenceJoined", participant);
  }

  handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    // Optionally navigate back or show a message
  }

  handleMuteStatus = (audio: any) => {
    console.log("handleMuteStatus", audio);
  }

  handleVideoStatus = (video: any) => {
    console.log("handleVideoStatus", video);
  }

  ngOnDestroy(): void {
      if (this.api) {
          this.api.dispose();
      }
  }

  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
       this.toastr.success('Meeting link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
      this.toastr.error('Failed to copy link');
    });
  }
}
