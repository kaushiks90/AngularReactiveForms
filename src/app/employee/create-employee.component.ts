import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  constructor(private fb: FormBuilder) {}

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
      email: [""],
      skills: this.fb.group({
        skillName: [""],
        experienceInYears: [""],
        proficiency: ["beginner"],
      }),
    });

    // Subscribe to valueChanges observable
    // this.employeeForm.get("fullName").valueChanges.subscribe((value) => {
    //   console.log(value);
    // });

    // Subscribe to FormGroup valueChanges observable
    // this.employeeForm.valueChanges.subscribe((value) => {
    //   console.log(JSON.stringify(value));
    // });
  }

  logKeyValuePairs(group: FormGroup): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key);
      // If the control is an instance of FormGroup i.e a nested FormGroup
      // then recursively call this same method (logKeyValuePairs) passing it
      // the FormGroup so we can get to the form controls in it
      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractControl);
        // If the control is not a FormGroup then we know it's a FormControl
      } else {
        console.log("Key = " + key + " && Value = " + abstractControl.value);
      }
    });
  }

  onLoadDataClick(): void {
    // this.employeeForm.setValue({
    //   fullName: "Pragim Technologies",
    //   email: "pragim@pragimtech.com",
    //   skills: {
    //     skillName: "C#",
    //     experienceInYears: 5,
    //     proficiency: "beginner",
    //   },
    // });

    this.employeeForm.patchValue({
      fullName: "Pragim Technologies",
      email: "pragim@pragimtech.com",
      // skills: {
      //   skillName: 'C#',
      //   experienceInYears: 5,
      //   proficiency: 'beginner'
      // }
    });

    this.logKeyValuePairs(this.employeeForm);
  }

  onSubmit(): void {
    console.log(this.employeeForm.controls.fullName.value);
    console.log(this.employeeForm.get("fullName").value);
    console.log(this.employeeForm.value);
  }
}
