import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { PageNotFoundComponent } from "./page-not-found.component";

const routes: Routes = [
  // home route
  { path: "home", component: HomeComponent },
  // redirect to the home route if the client side route path is empty
  { path: "", redirectTo: "/home", pathMatch: "full" },

  {
    path: "employees",
    loadChildren: "./employee/employee.module#EmployeeModule",
  },
  // wild card route
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
