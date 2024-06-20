export class Message {
  public author: string;
  public content: string;
  public creationDate: Date;

  constructor(author: string, content: string) {
    this.author = author;
    this.content = content;
    this.creationDate = new Date();
  }
}
