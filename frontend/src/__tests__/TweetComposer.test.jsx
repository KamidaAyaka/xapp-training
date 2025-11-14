import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TweetComposer from "../components/TweetComposer";

describe("TweetComposer", () => {
  beforeEach(() => {
    // fetch をグローバルにモック。必要に応じて個別で mockResolvedValue する。
    global.fetch = jest.fn();
    // localStorage を必要に応じてセット（コンポーネント内で getItem を使うため）
    window.localStorage.setItem("xapp_userId", "1");
    // alert をモックしてテスト中に実際のダイアログが出ないようにする
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders textarea and submit button (disabled when empty)", () => {
    render(<TweetComposer onPosted={jest.fn()} />);
    const textarea = screen.getByPlaceholderText("いまどうしてる？");
    expect(textarea).toBeInTheDocument();

    // ボタン（ラベルは "投稿"）
    const btn = screen.getByRole("button", { name: /投稿|送信中.../ });
    expect(btn).toBeInTheDocument();
    // 初期は disabled（空文）
    expect(btn).toBeDisabled();
  });

  test("enables submit when textarea has content and posts successfully", async () => {
    const fakeCreated = { id: 42, content: "hello" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeCreated,
    });

    const onPosted = jest.fn();
    render(<TweetComposer onPosted={onPosted} />);

    const textarea = screen.getByPlaceholderText("いまどうしてる？");
    const btn = screen.getByRole("button", { name: /投稿|送信中.../ });

    // 入力してボタンが有効になる
    fireEvent.change(textarea, { target: { value: "hello" } });
    expect(btn).not.toBeDisabled();

    // クリック（submit）
    fireEvent.click(btn);

    // fetch が呼ばれるのを待つ
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // onPosted が呼ばれる（created オブジェクトが渡される）
    await waitFor(() => expect(onPosted).toHaveBeenCalledWith(expect.objectContaining({ id: 42 })));

    // textarea はクリアされている
    expect(textarea).toHaveValue("");
  });

  test("shows alert on failed post", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "bad" }),
    });

    render(<TweetComposer onPosted={jest.fn()} />);

    const textarea = screen.getByPlaceholderText("いまどうしてる？");
    const btn = screen.getByRole("button", { name: /投稿|送信中.../ });

    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.click(btn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("投稿エラー")));
  });
});
