
/*  ID13: O aluno utilizou efetivamente as diretivas @Input e @Output para estabelecer uma 
  comunicanção em uma hierarquia de componentes, passando e recebendo dados entre componentes 
  de maneira segura e consistente.  */
  
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
  @Input() audioSrc: string = "../../../assets/music/fundo-de-oração.mp3";
  @Output() isPlayingChange = new EventEmitter<boolean>();

  isPlaying: boolean = true; 

  ngOnInit() {
    const audioElement: HTMLAudioElement = this.getAudioElement();
    audioElement.volume = 0.5; 

    audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.isPlayingChange.emit(true); 
    });

    audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.isPlayingChange.emit(false); 
    });
  }

  playPause() {
    const audioElement = this.getAudioElement();
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  setVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const audioElement = this.getAudioElement();
      audioElement.volume = parseFloat(target.value);
    }
  }

  private getAudioElement(): HTMLAudioElement {
    return document.getElementById('oracaoAudio') as HTMLAudioElement;
  }
}

