import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "b2c",
    pathMatch: "full"
  },
  {
    path: "b2b",
    loadChildren: "./b2b/b2b.module#B2BModule"
  },
  {
    path: "b2c",
    loadChildren: "./b2c/b2c.module#B2CModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "top"
      // useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
