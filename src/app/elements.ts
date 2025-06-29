export default class Elements {
  private static readonly DRAGGABLE_COUNT = 20;
  draggableCount!: number;
  draggablePieces!: HTMLElement[];
  puzzlePieces!: HTMLElement[];
  puzzle!: HTMLElement;
  modelImage!: HTMLImageElement;
  loader!: HTMLElement;
  draggables!: HTMLElement;
  randomImageButton!: HTMLButtonElement;
  modal!: HTMLElement;
  attempts!: HTMLElement;
  modalButton!: HTMLButtonElement;
  modalText!: HTMLElement;
  fileInput!: HTMLInputElement;

  constructor(draggableCount = Elements.DRAGGABLE_COUNT) {
    if (typeof draggableCount !== "number" || draggableCount < 0) {
      console.error("Draggable count must be a positive number");
      return;
    }
    this.draggableCount = draggableCount;
    this.draggablePieces = [];
    this.puzzlePieces = [];
    this.initializeRequiredElements();
    this.createPieces();
  }

  private getRequiredElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
      console.error(`Element ${selector} not found`);
      throw new Error(`Element ${selector} not found`);
    }
    return element;
  }

  private initializeRequiredElements() {
    this.puzzle = this.getRequiredElement<HTMLElement>(".puzzle");
    this.modelImage = this.getRequiredElement<HTMLImageElement>(".model-image");
    this.loader = this.getRequiredElement<HTMLElement>(".loader");
    this.draggables = this.getRequiredElement<HTMLElement>(".draggables");
    this.randomImageButton =
      this.getRequiredElement<HTMLButtonElement>(".random-img-btn");
    this.modal = this.getRequiredElement<HTMLElement>(".modal");
    this.attempts = this.getRequiredElement<HTMLElement>(".attempts");
    this.modalButton = this.getRequiredElement<HTMLButtonElement>(".modal-btn");
    this.modalText = this.getRequiredElement<HTMLElement>(".modal-text");
    this.fileInput = this.getRequiredElement<HTMLInputElement>("#file-input");
  }

  private createDraggablePieces(index: number): HTMLElement {
    const piece = document.createElement("div");
    piece.classList.add("draggable-piece");
    piece.setAttribute("data-index", String(index));
    piece.setAttribute("draggable", "true");
    return piece;
  }

  private createPuzzlePiece(index: number): HTMLElement {
    const piece = document.createElement("div");
    piece.classList.add("puzzle-piece");
    piece.setAttribute("data-index", String(index));
    return piece;
  }

  createPieces() {
    for (let i = 0; i < this.draggableCount; i++) {
      const draggablePiece = this.createDraggablePieces(i);
      this.draggablePieces.push(draggablePiece);

      const puzzlePiece = this.createPuzzlePiece(i);
      if (!this.puzzle) {
        console.error("Puzzle element not found");
        throw new Error("Puzzle element not found");
      }
      this.puzzle.append(puzzlePiece);
      this.puzzlePieces.push(puzzlePiece);
    }
  }
}
