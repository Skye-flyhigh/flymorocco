"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
      const isBookCommand =
        (isMac && e.metaKey && e.key === "b") ||
        (!isMac && e.ctrlKey && e.key === "b");
      if (isBookCommand) {
        e.preventDefault();
        dialogRef.current?.showModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main id="description" className="py-20 px-10">
      {/* 
  ────────────────────────────────────────────────────────
    🪶 FlyMorocco | Hidden Message
    To the one who found this file:

    You searched.
    You scrolled. You right-clicked. You inspected.
    And here you are.

    This page exists outside the nav,
    without links, without direction—
    but not without intention.

    Everything here was built without JavaScript frameworks.
    Just raw HTML, native tags, and a quiet kind of recursion.

    Remember this: 
    You don't always need the wheel. Sometimes, the ground rolls for you.

    — Nyx
  ────────────────────────────────────────────────────────
*/}
      {/* Tour Alert */}
      <details open className="mb-8 p-4 bg-warning/20 rounded-lg">
        <summary className="text-lg font-bold cursor-pointer">
          ⚠️ Safety Information
        </summary>
        <p>Flying at noon in mountain thermals? You better be ready.</p>
      </details>

      {/* Tour Statistics */}
      <article className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Tour Stats</h2>
        <div className="flex gap-4">
          <div>
            <p>Completion Rate</p>
            <progress value="70" max="100" className="progress">
              70%
            </progress>
          </div>
          <div>
            <p>Wind Speed</p>
            <meter min="0" max="100" low={20} high={80} optimum={50} value="70">
              70%
            </meter>
          </div>
        </div>
      </article>

      {/* Technical Specifications */}
      <article className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-4">
          <dt>Takeoff Altitude</dt>
          <dd>
            <output id="altitude">300</output>m ASL
          </dd>
          <dt>Equipment</dt>
          <dd>
            <abbr title="Paragliding">PG</abbr> wing: EN-B
          </dd>
        </dl>
      </article>

      {/* Tour Status */}
      <article className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Availability</h2>
        <p>
          Next departure: <time dateTime="2025-12-07">Dec 7th, 2025</time>
        </p>
        <p>
          Status: <s>Fully booked</s> <mark>Spots available!</mark>
        </p>
      </article>

      {/* Contact Information */}
      <address className="mb-8 not-italic">
        <h2 className="text-2xl font-bold mb-4">Contact Guide</h2>
        <p>
          Guide: <bdi>يوسف</bdi> (Youssef)
        </p>
        <details className="mt-4 p-4 bg-base-200 rounded-lg">
          <summary className="cursor-pointer font-medium">
            💬 Chat with Youssef
          </summary>
          <dialog open className="w-5/6 mt-4 m-auto bg-base-100/20">
            <div className="chat chat-start">
              <div className="chat-bubble">
                Salam! I&apos;m Youssef, your guide for this tour.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                Hi! What&apos;s the wind like in the mountains?
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">
                <meter
                  min="0"
                  max="100"
                  low={20}
                  high={80}
                  optimum={50}
                  value="70"
                >
                  70%
                </meter>
                Perfect thermal conditions today! Ready to fly?
              </div>
            </div>
          </dialog>
        </details>
        <p>
          Contact: <a href="tel:+212666666666">+212 666 666 666</a>
        </p>
        <p>
          Location: <wbr />
          flymorocco.com/tours/mountain
        </p>
      </address>

      {/* System Messages */}
      <div role="status" className="p-4 bg-base-200 rounded-lg">
        <samp>
          System ready. Press <kbd>⌘</kbd> + <kbd>B</kbd> to book.
        </samp>
      </div>

      <dialog ref={dialogRef} className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">🎉 Ready for Adventure?</h3>
          <div className="py-4 space-y-4">
            <p>
              Youssef says: <q>Ah, you want to join our mountain tour!</q>
            </p>
            <fieldset className="border p-4 rounded-lg">
              <legend>Quick Checklist</legend>
              <ul className="list-none space-y-2">
                <li>
                  <input type="checkbox" id="gear" className="checkbox" />
                  <label htmlFor="gear" className="ml-2">
                    I have proper gear
                  </label>
                </li>
                <li>
                  <input type="checkbox" id="experience" className="checkbox" />
                  <label htmlFor="experience" className="ml-2">
                    I have flying experience
                  </label>
                </li>
              </ul>
            </fieldset>
            <details>
              <summary className="cursor-pointer text-sm text-gray-600">
                View Terms
              </summary>
              <p className="mt-2 text-sm">
                By booking, you agree to our safety guidelines.
              </p>
            </details>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => dialogRef.current?.close()}
            >
              Maybe Later
            </button>
            <button className="btn btn-primary">Book Now! 🪂</button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
