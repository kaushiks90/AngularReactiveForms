import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, AbstractControl } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    fullName: "",
    email: "",
    phone: "",
    skillName: "",
    experienceInYears: "",
    proficiency: "",
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    fullName: {
      required: "Full Name is required.",
      minlength: "Full Name must be greater than 2 characters.",
      maxlength: "Full Name must be less than 10 characters.",
    },
    email: {
      required: "Email is required.",
      emailDomain: "Email domian should be pragimtech.com",
    },
    phone: {
      required: "Phone is required.",
    },
    skillName: {
      required: "Skill Name is required.",
    },
    experienceInYears: {
      required: "Experience is required.",
    },
    proficiency: {
      required: "Proficiency is required.",
    },
  };
  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      contactPreference: ["email"],
      email: ["", [Validators.required, this.emailDomain("dell.com")]],
      phone: [""],
      skills: this.fb.group({
        skillName: ["", Validators.required],
        experienceInYears: ["", Validators.required],
        proficiency: ["", Validators.required],
      }),
    });

    this.employeeForm
      .get("contactPreference")
      .valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
      });
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key);
      // If the control is an instance of FormGroup i.e a nested FormGroup
      // then recursively call this same method (logValidationErrors) passing it
      // the FormGroup so we can get to the form controls in it
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is not a FormGroup then we know it's a FormControl
      } else {
        // Clear the existing validation errors
        this.formErrors[key] = "";
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          // Get all the validation messages of the form control
          // that has failed the validation
          const messages = this.validationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + " ";
            }
          }
        }
      }
    });
  }

  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get("phone");
    if (selectedValue === "phone") {
      phoneFormControl.setValidators(Validators.required);
    } else if (selectedValue === "email") {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }
  onLoadDataClick(): void {
    this.employeeForm.patchValue({
      fullName: "Pragim Technologies",
      email: "pragim@pragimtech.com",
      // skills: {
      //   skillName: 'C#',
      //   experienceInYears: 5,
      //   proficiency: 'beginner'
      // }
    });

    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  emailDomain(domainName: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf("@") + 1);
      if (email === "" || domain.toLowerCase() === "pragimtech.com") {
        return null;
      } else {
        return { emailDomain: true };
      }
    };
  }
  onSubmit(): void {
    console.log(this.employeeForm.controls.fullName.value);
    console.log(this.employeeForm.get("fullName").value);
    console.log(this.employeeForm.value);
  }
}
