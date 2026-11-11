(() => {
  const improveButton = document.getElementById('improve-prompt');
  const promptField = document.getElementById('prompt');
  const output = document.getElementById('output');
  const error = document.getElementById('error');
  const generateButton = document.getElementById('generate');

  if (!improveButton || !promptField || !output || !error || !generateButton) return;

  async function waitForBotResult() {
    let target = 0;
    for (let i = 0; i < 120; i += 1) {
      const data = await chatApi('messages', { chat_id: CHAT, after: last, edit_after: editCursor });
      editCursor = Number(data.edit_cursor || editCursor);

      for (const message of data.messages || []) {
        last = Math.max(last, Number(message.id));
        if (Number(message.user_id) === ME) continue;
        target = Number(message.id);
        output.textContent = message.body;
        if (/^[✅❌]/.test(message.body)) return message.body;
      }

      for (const edit of data.edited_messages || []) {
        if (!target || Number(edit.message_id) === target) {
          output.textContent = edit.body;
          if (/^[✅❌]/.test(edit.body)) return edit.body;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    throw new Error('ИИ отвечает слишком долго. Результат появится в чате @compilerbot.');
  }

  improveButton.addEventListener('click', async () => {
    const source = promptField.value.trim();
    if (!source) {
      error.textContent = 'Сначала опишите будущий сайт.';
      promptField.focus();
      return;
    }
    if (!CHAT || busy) return;

    busy = true;
    error.textContent = '';
    improveButton.disabled = true;
    generateButton.disabled = true;
    output.innerHTML = '<span class="spinner"></span> ИИ уточняет структуру, стиль и требования…';

    try {
      await chatApi('message.send', {
        chat_id: CHAT,
        body: '/improve-prompt ' + source,
        nonce: nonce(),
      }, true);
      const result = await waitForBotResult();
      if (result.startsWith('❌')) throw new Error(result.replace(/^❌\s*Результат\s*/i, '').trim());

      const improved = result
        .replace(/^✅\s*Результат\s*/i, '')
        .replace(/^✨\s*Улучшенный промпт\s*/i, '')
        .trim();
      if (!improved) throw new Error('ИИ не вернул улучшенный промпт.');

      promptField.value = improved;
      promptField.dispatchEvent(new Event('input', { bubbles: true }));
      output.textContent = 'Готово. Проверьте улучшенный промпт и нажмите «Создать с ИИ».';
      promptField.focus();
    } catch (reason) {
      error.textContent = reason instanceof Error ? reason.message : String(reason);
    } finally {
      busy = false;
      improveButton.disabled = false;
      generateButton.disabled = !document.getElementById('permission').hidden || !CHAT;
    }
  });
})();
