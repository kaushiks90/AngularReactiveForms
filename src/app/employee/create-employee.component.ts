import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { CustomValidators } from "../shared/custom.validators";
import { ActivatedRoute } from "@angular/router";
import { EmployeeService } from "./employee.service";
import { IEmployee } from "./IEmployee";
import { ISkill } from "./ISkill";
@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}
  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    fullName: "",
    confirmEmail: "",
    email: "",
    emailGroup: "",
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
    confirmEmail: {
      required: "Confirm Email is required.",
    },
    emailGroup: {
      emailMismatch: "Email and Confirm Email do not match.",
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
      emailGroup: this.fb.group(
        {
          email: [
            "",
            [Validators.required, CustomValidators.emailDomain("dell.com")],
          ],
          confirmEmail: ["", [Validators.required]],
        },
        { validator: this.matchEmails }
      ),
      phone: [""],
      skills: this.fb.array([this.addSkillFormGroup()]),
    });

    this.employeeForm
      .get("contactPreference")
      .valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
      });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe((params) => {
      const empId = +params.get("id");
      if (empId) {
        this.getEmployee(empId);
      }
    });
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => this.editEmployee(employee),
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email,
      },
      phone: employee.phone,
    });
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ["", Validators.required],
      experienceInYears: ["", Validators.required],
      proficiency: ["", Validators.required],
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get("skills")).push(this.addSkillFormGroup());
  }
  removeSkillButtonClick(skillGroupIndex: number): void {
    (<FormArray>this.employeeForm.get("skills")).removeAt(skillGroupIndex);
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key);
      // Clear the existing validation errors
      this.formErrors[key] = "";
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched ||
          abstractControl.dirty ||
          abstractControl.value !== "")
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

      // If the control is an instance of FormGroup i.e a nested FormGroup
      // then recursively call this same method (logValidationErrors) passing it
      // the FormGroup so we can get to the form controls in it

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is not a FormGroup then we know it's a FormControl
      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
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
  // Nested form group (emailGroup) is passed as a parameter. Retrieve email and
  // confirmEmail form controls. If the values are equal return null to indicate
  // validation passed otherwise an object with emailMismatch key. Please note we
  // used this same key in the validationMessages object against emailGroup
  // property to store the corresponding validation error message
  matchEmails(group: AbstractControl): { [key: string]: any } | null {
    const emailControl = group.get("email");
    const confirmEmailControl = group.get("confirmEmail");

    if (
      emailControl.value === confirmEmailControl.value ||
      (confirmEmailControl.pristine && confirmEmailControl.value === "")
    ) {
      return null;
    } else {
      return { emailMismatch: true };
    }
  }

  onSubmit(): void {
    console.log(this.employeeForm.controls.fullName.value);
    console.log(this.employeeForm.get("fullName").value);
    console.log(this.employeeForm.value);
  }
}
