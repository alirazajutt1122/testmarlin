import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { NewsAdvertisementService } from '../news_advertisements.service';


@Component({
  selector: 'app-add-news-and-advertisement',
  templateUrl: './add-news-and-advertisement.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class AddNewsAndAdvertisementComponent implements OnInit {

  public myForm: FormGroup;
  allAssetClass: any
  tempBase64: any
  attachment: String

  constructor(
    public matDialogRef: MatDialogRef<AddNewsAndAdvertisementComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private na_Service: NewsAdvertisementService,
    private toast: ToastrService,
    private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.addFromValidations()
    this.getAssetClasses()
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      naTitle: ['', Validators.required],
      naDetail: ['', Validators.required],

      naEntryDate: [new Date().toISOString().slice(0, 10)],
      naExpiryDate: [new Date().toISOString().slice(0, 10)],

      active: ['', Validators.required],
      assetClassBO: ['', Validators.required],
      naType: ['0', Validators.required],
      naWebLink: ['',],
      naImage: ['',]
    });
  }
  onCloseDialog() {
    this.matDialogRef.close();
  }

  getAssetClasses() {
    this.na_Service.getAssetClass().subscribe((data) => {
      this.allAssetClass = data;
    });
  }

  onFileSelected(event) {
    let file = event.files[0];

    this.convertImgToBase64(file)
    setTimeout(() => {
      this.attachment = this.tempBase64
    }, 500);



    console.log(this.attachment);
  }
  convertImgToBase64(file: any) {
    localStorage.removeItem("naImg")
    let me = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      me.tempBase64 = reader.result;
      let v = me.tempBase64.split(',')
      me.tempBase64 = v[1]
      localStorage.setItem("naImg", me.tempBase64)
      console.log(me.tempBase64);

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    this.tempBase64 = localStorage.getItem("naImg")
    //console.log(this.tempBase64);
  }

  submit() {
    if (this.myForm.valid) {
      let data = this.myForm.value;
      data.naImage = this.attachment

      this.na_Service.saveNewsAnnouncmentData(data).subscribe((res) => {
        this.toast.success('Data Submitted successfully', 'Success');
        const data = this.myForm.getRawValue();
        data.tempImg = res.naImage;
        this.matDialogRef.close(data)
      },
        (er) => {
          this.toast.error('Data Not Correct', 'Error');
        }
      );
    } else {
      this.toast.error('Please Complete The Form To Continue', ' Error')
    }
  }

}
