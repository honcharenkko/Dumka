import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadMyDataPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: реалізувати логіку завантаження
    console.log({ title, desc, file });
    alert("Джерело додано успішно!");
    navigate(-1); // повернення назад
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Додати нове джерело
        </h1>

        <form onSubmit={handleSubmit} className="form-control gap-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Назва джерела</span>
            </label>
            <input
              type="text"
              placeholder="Наприклад, Конспект лекції №1"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Опис</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Короткий опис змісту або мети джерела"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Файл</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost"
            >
              Скасувати
            </button>
            <button type="submit" className="btn btn-primary">
              Зберегти джерело
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadMyDataPage;
