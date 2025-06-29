import Positions from "./positions";

export default class DragAndDrop {
  positions: Positions;
  selectedPiece: HTMLElement | null;
  points: { correct: number; incorrect: number };

  constructor() {
    this.positions = new Positions();
    this.selectedPiece = null;
    this.points = { correct: 0, incorrect: 0 };
    this.init();
  }

  init() {
    this.dragAndDrop();
    this.uploadImage();
  }

  private updateScore(idx: number, puzzPieces: HTMLElement[]) {
    if (
      this.selectedPiece &&
      this.selectedPiece.dataset.index === puzzPieces[idx].dataset.index
    ) {
      this.points.correct++;
    } else {
      this.points.incorrect++;
    }
  }

  private handlePageReload = () => location.reload();

  private handleModalButtonClick() {
    const { modalButton } = this.positions.elements;
    if (!modalButton) {
      console.error("Modal button is not defined");
      throw new Error("Modal button is not defined");
    }
    modalButton.removeEventListener("click", this.handlePageReload);
    modalButton.addEventListener("click", this.handlePageReload);
  }

  private applyPieceStyles(idx: number, puzzlePieces: HTMLElement[]) {
    if (!this.selectedPiece) {
      console.error("Faile to apply piece styles");
      return;
    }
    this.selectedPiece.style.top = "0";
    this.selectedPiece.style.left = "0";
    this.selectedPiece.style.border = "none";
    puzzlePieces[idx].appendChild(this.selectedPiece);
    this.updateScore(idx, puzzlePieces);
  }

  private handleDrop(
    puzzlePieces: HTMLElement[],
    idx: number,
    draggableCount: number,
    modal: HTMLElement,
    attempts: HTMLElement,
    modalText: HTMLElement
  ) {
    if (this.selectedPiece && puzzlePieces[idx].children.length === 0) {
      try {
        this.applyPieceStyles(idx, puzzlePieces);

        if (this.points.correct === draggableCount) {
          modal.classList.add("visible");
          attempts.textContent = String(this.points.incorrect);
          this.handleModalButtonClick();
        }

        const correctPieces = (Array.from(puzzlePieces) as HTMLElement[]).find(
          (piece) => !piece.firstElementChild
        );

        if (!correctPieces && this.points.correct < draggableCount) {
          modal.classList.add("visible");
          modalText.textContent = "You lost! Please try again.";
          this.handleModalButtonClick();
        }
      } catch (err) {
        throw new Error("Faile to handle drop event");
      }
    }
  }

  dragAndDrop() {
    const {
      draggablePieces,
      puzzlePieces,
      draggableCount,
      modal,
      attempts,
      modalText,
    } = this.positions.elements;
    if (!draggablePieces) {
      console.error("Draggable pieces are not defined");
      return;
    }
    if (!puzzlePieces) {
      console.error("Puzzle pieces are not defined");
      return;
    }
    if (!draggableCount) {
      console.error("Draggable count is not defeined");
      return;
    }
    if (!modal) {
      console.error("Modal is not defined");
      return;
    }
    if (!attempts) {
      console.error("Attempts are not defined");
    }
    if (!modalText) {
      console.error("Modal text is not defined");
      return;
    }

    draggablePieces.forEach((draggablePiece: HTMLElement, index: number) => {
      draggablePiece.addEventListener("dragstart", (e) => {
        if (!e.currentTarget || !(e.currentTarget instanceof HTMLElement)) {
          console.error("Invalid draggable piece element");
          throw new Error("Invalid draggable piece element");
        }
        this.selectedPiece = e.currentTarget;
      });
      puzzlePieces[index].addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      puzzlePieces[index].addEventListener("drop", () => {
        this.handleDrop(
          puzzlePieces,
          index,
          draggableCount,
          modal,
          attempts,
          modalText
        );
      });
      puzzlePieces[index].addEventListener("dragenter", () => {
        puzzlePieces[index].classList.add("active");
      });
      puzzlePieces[index].addEventListener("dragleave", () => {
        puzzlePieces[index].classList.remove("active");
      });
    });
  }

  private resetGameState() {
    this.points = { correct: 0, incorrect: 0 };
  }

  uploadImage() {
    const { fileInput, modelImage, draggablePieces } = this.positions.elements;
    if (!fileInput) {
      console.error("File input is not defined");
    }
    if (!modelImage) {
      console.error("Model image is not defined");
    }
    if (!draggablePieces) {
      console.error("Draggable pieces are not defined");
    }

    let previousUrl: string | null = null;
    fileInput.addEventListener("change", () => {
      if (!fileInput.files || !fileInput.files[0]) {
        console.error("No file selected");
        throw new Error("No file selected");
      }
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      const url = URL.createObjectURL(fileInput.files[0]);
      if (!url) {
        console.error("Unable to create object URL");
        throw new Error("Unable to create object URL");
      }
      previousUrl = url;
      modelImage.style.backgroundImage = `url(${url})`;
      draggablePieces.forEach((draggablePiece: HTMLElement) => {
        draggablePiece.style.backgroundImage = `url(${url})`;
      });
    });
    this.resetGameState();
  }
}
