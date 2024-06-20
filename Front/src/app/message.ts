import { Signal } from "./signal"

export class Message extends Signal {
  public content: string

  constructor(token: string, content: string) {
    super(token)
    this.content = content
  }

}
