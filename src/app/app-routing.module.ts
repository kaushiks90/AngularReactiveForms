import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { PageNotFoundComponent } from "./page-not-found.component";
import { PreloadAllModules } from "@angular/router";
import { CustomPreloadingService } from "./custom-preloading.service";
const routes: Routes = [
  // home route
  { path: "home", component: HomeComponent },
  // redirect to the home route if the client side route path is empty
  { path: "", redirectTo: "/home", pathMatch: "full" },

  {
    path: "employees",
    data: { preload: true },
    loadChildren: "./employee/employee.module#EmployeeModule",
  },
  // wild card route
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
