"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import StatisticItem from "./StatisticItem";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";
import Modal from "@/components/shared/Modal";
import { useState } from "react";

export default function SummaryItems({
  totalCount,
  completedCount,
  favoritedCount,
  totalReviews,
  totalQuotes,
  totalReflections
}: {
  totalCount: number;
  completedCount: number;
  favoritedCount: number;
  totalReviews: number;
  totalQuotes: number;
  totalReflections: number;
}) {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} setOpen={setOpen} title={"Find Book"}>
        <Search openModal={openModal} closeModal={closeModal} />
      </Modal>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-2">
              <StatisticItem label="books completed" value={completedCount} />
              <StatisticItem
                label="books total"
                value={totalCount}
                path="books"
              />
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
            <Button onClick={() => openModal()}>Add Book</Button>
            <Button>Lorem Ipsum</Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardContent className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-2">
              <StatisticItem label="books favorited" value={favoritedCount} />
              <StatisticItem
                label="books reviewed"
                value={totalReviews}
                path="reviews"
              />
            </div>
            <div className="grid grid-cols-2">
              <StatisticItem
                label="quotes captured"
                value={totalQuotes}
                path="quotes"
              />
              <StatisticItem
                label="reflections added"
                value={totalReflections}
                path="reflections"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
