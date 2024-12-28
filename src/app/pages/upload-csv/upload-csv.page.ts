import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { NavController, Platform } from '@ionic/angular';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.page.html',
  styleUrls: ['./upload-csv.page.scss'],
})
export class UploadCsvPage implements OnInit {

  fileName = "file";
  uploadForm: FormGroup;
  constructor(
    private fileChooser: FileChooser,
    private filepath : FilePath,
    private file : File,
    public formBuilder: FormBuilder,
    private platform : Platform,
    private filePicker : IOSFilePicker,
    private nav: NavController
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      fileName: ['', [Validators.required ]],
    })
  }

  // select the file from device
  async selectFile() {
    // this.fileName = '';
    if(this.platform.is('android')){
      const selectedFile : string = await this.fileChooser.open()
      const resolvedPath = await this.filepath.resolveNativePath(selectedFile);
      const fileEntry = await this.file.resolveLocalFilesystemUrl(resolvedPath) as any;
      fileEntry.file((fileInfo)=>{
        var fileData: any = fileInfo;
        this.fileName = fileData.name.toString();
        this.uploadForm.controls.fileName.setValue(this.fileName)
      })
    }else{
      //For ios device 
      const selectedFile : string = await  this.filePicker.pickFile() ;
      const fileEntry = await this.file.resolveLocalFilesystemUrl('file:///'+selectedFile) as any;
      fileEntry.file((fileInfo)=>{
        var fileData: any = fileInfo;
        this.fileName = fileData.name.toString();
        this.uploadForm.controls.fileName.setValue(this.fileName)
      })
    }
  }

  // call save file api
  importFile() {
    // call api
  }

}
