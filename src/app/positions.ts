import Elements from "./elements";

export default class Positions {
  private static readonly TOP_POSITIONS = [0, 6, 12, 18];
  private static readonly LEFT_POSITIONS = [0, 8, 16, 24, 32];
  private static readonly IMAGE_API_BASE_URL = "https://picsum.photos";
  private static readonly IMAGE_DIMENSIONS = { width: 1920, height: 1080 };
  elements: Elements;
  topPositions: number[];
  leftPositions: number[];
  imageUrl?: string;

  constructor() {
    this.elements = new Elements();
    this.topPositions = Positions.TOP_POSITIONS;
    this.leftPositions = Positions.LEFT_POSITIONS;
    this.init();
  }

  async init() {
    await this.setDraggablePieces();
  }

  generatePositionsGrid() {
    return this.topPositions.flatMap((top) =>
      this.leftPositions.map((left) => [left, top])
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    if (!array || array.length === 0) {
      console.error("Argument array is empty or undefined");
    }
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  shufflePositions() {
    return this.shuffleArray(this.generatePositionsGrid());
  }

  backgroundPositions() {
    return this.generatePositionsGrid();
  }

  async getRandomImage(
    dimensions = Positions.IMAGE_DIMENSIONS,
    imageApiUrl = Positions.IMAGE_API_BASE_URL,
    timeoutMs = 10000
  ) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(
        `${imageApiUrl}/${dimensions.width}/${
          dimensions.height
        }?random=${Math.random()}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        console.error(`Invalid content type:${contentType}`);
      }
      return response.url;
    } catch (err) {
      clearTimeout(timeout);
      throw new Error(`Failed to fetch random image: ${err}`);
    }
  }

  async setRandomImage() {
    const { modelImage, loader } = this.elements;
    if (!modelImage || !loader) {
      throw new Error("Model image or loader element not found");
    }
    loader.classList.add("active");
    try {
      this.imageUrl = await this.getRandomImage();
      modelImage.style.backgroundImage = `url(${this.imageUrl})`;
    } catch (err) {
      console.error(`Unable to set random image: ${err}`);
      throw new Error("Unable to set random image");
    } finally {
      loader.classList.remove("active");
    }
  }

  private applyPieceStyles(
    piece: HTMLElement,
    backPos: number[],
    shuffPos: number[]
  ) {
    piece.style.backgroundImage = `url(${this.imageUrl})`;
    piece.style.backgroundPosition = `-${backPos[0]}vw -${backPos[1]}vw`;
    piece.style.left = `${shuffPos[0]}vw`;
    piece.style.top = `${shuffPos[1]}vw`;
  }

  private handlePageReload = () => location.reload();

  private handleRandomImageClick() {
    const { randomImageButton } = this.elements;
    if (!randomImageButton) {
      console.error("Random image button is not defined");
      return;
    }
    randomImageButton.removeEventListener("click", this.handlePageReload);
    randomImageButton.addEventListener("click", this.handlePageReload);
  }

  async setDraggablePieces() {
    const { draggablePieces, draggables } = this.elements;
    if (!draggablePieces) {
      console.error("Draggable pieces are not defined");
    }
    if (!draggables) {
      console.error("Draggables are not defined");
    }

    try {
      await this.setRandomImage();
      const shuffledPositions = this.shufflePositions();
      const backgroundPositions = this.backgroundPositions();

      if (!shuffledPositions.length || !backgroundPositions.length) {
        console.error("Shuffled positions or background positions are empty");
      }
      if (draggablePieces.length > shuffledPositions.length) {
        console.error("Not enough positions for draggable pieces");
      }

      draggablePieces.forEach((draggablePiece: HTMLElement, index: number) => {
        if (!draggablePiece) {
          console.error("Draggable piece is not defined");
        }
        draggables.append(draggablePiece);
        this.applyPieceStyles(
          draggablePiece,
          backgroundPositions[index],
          shuffledPositions[index]
        );
      });
      this.handleRandomImageClick();
    } catch (err) {
      console.error(`Unable to set draggable pieces: ${err}`);
      throw new Error("Unable to set draggable pieces");
    }
  }
}
