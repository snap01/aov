/* global $ */
import { AOVChat } from '../apps/chat.mjs'

export default function (app, html, data) {
  AOVChat.renderMessageHook(app, html, data)
}