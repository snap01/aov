/* global $ */
import { AOVChat } from '../chat/chat.mjs'

export default function (app, html, data) {
  AOVChat.renderMessageHook(app, html, data)
}