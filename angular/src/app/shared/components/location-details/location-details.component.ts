import { Component, Input, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { DemoDataService } from "../../services/demo-data.service";
import { Comment } from "../../classes/comment";
import { Location } from "../../classes/location";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { User } from "../../classes/user";

@Component({
  selector: "app-location-details",
  templateUrl: "location-details.component.html",
  styles: [],
})
export class LocationDetailsComponent {
  modalRef?: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}
  @Input() location!: Location;

  protected newComment: Comment = {
    author: "",
    rating: 0,
    comment: "",
  };

  public isConnected(): boolean {
    if (!this.connectionService.isConnected) this.closeModal();
    return this.connectionService.isConnected;
  }

  protected addNewComment() {
    this.formDataError = "";
    this.newComment.author = this.getCurrentUser();
    if (this.isFormDataValid()) {
      this.demoDataService
        .addCommentToLocation(this.location._id, this.newComment)
        .subscribe({
          next: (comment: Comment) => {
            this.location?.comments?.unshift(comment);
            this.updateAverageRating();
            this.closeModal();
          },
          error: (err) => {
            this.formDataError = err || "Error adding comment.";
          },
        });
    } else {
      this.formDataError =
        "All fields required, including rating between 1 and 5.";
    }
  }

  protected deleteComment(commentId: string | undefined): void {
    if (commentId) {
      this.demoDataService
        .deleteCommentFromLocation(this.location._id, commentId)
        .subscribe({
          next: () => {
            this.location.comments = this.location.comments?.filter(
              (comment) => comment._id !== commentId
            );
            this.updateAverageRating();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  private updateAverageRating() {
    if (this.location && this.location.comments) {
      const count: number = this.location.comments.length;
      const total: number = this.location.comments.reduce((acc, { rating }) => {
        return acc + rating;
      }, 0);
      this.location.rating = Math.floor(total / count);
    } else {
      this.location.rating = 0;
    }
  }

  protected formDataError!: string;

  private isFormDataValid(): boolean {
    let isValid = false;
    if (
      this.newComment.author &&
      this.newComment.rating &&
      this.newComment.comment &&
      this.newComment.rating >= 1 &&
      this.newComment.rating <= 5
    ) {
      isValid = true;
    }
    return isValid;
  }

  protected openModal(form: TemplateRef<any>) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  protected closeModal() {
    this.newComment = {
      author: "",
      rating: 0,
      comment: "",
    };
    this.formDataError = "";
    this.modalRef?.hide();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getCurrentUser(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }

  public canDeleteComment(comment: Comment): boolean {
    return this.isLoggedIn() && this.getCurrentUser() === comment.author;
  }
}
