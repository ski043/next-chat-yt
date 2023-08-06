"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

interface iAppProps {
  data: {
    User: {
      image: string | null;
      name: string | null;
    };
    message: string;
  }[];
}

export default function ChatComponent({ data }: iAppProps) {
  const [totalComments, setTotalComments] = useState(data);
  const messageEndRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: "eu",
    });

    var channel = pusher.subscribe("chat");
    channel.bind("hello", function (data: any) {
      const parsedComments = JSON.parse(data.message);

      setTotalComments((prev) => [...prev, parsedComments]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const scrollTobottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollTobottom();
  }, [totalComments]);

  return (
    <div className="p-6 flex-grow max-h-screen overflow-y-auto py-32">
      <div className="flex flex-col gap-4">
        {totalComments.map((message, index) => (
          <div key={index}>
            <div className="flex items-center">
              <Image
                src={message.User.image as string}
                alt="Profile image of user"
                className="w-12 h-12 object-cover rounded-lg mr-4"
                width={50}
                height={50}
              />
              <div className="rounded-lg bg-white p-4 shadow-md self-start">
                {message.message}
              </div>
            </div>

            <p className="font-light text-sm text-gray-600">
              {message.User.name}
            </p>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
}
