import { motion } from "framer-motion";
import { UNITS, type Unit } from "@/lib/data";

interface UnitTabsProps {
  selected: Unit | null;
  onSelect: (unit: Unit | null) => void;
}

const UnitTabs = ({ selected, onSelect }: UnitTabsProps) => {
  return (
    <section className="px-4 pb-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Unit
        </h2>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={`min-w-[56px] px-4 py-2.5 text-sm font-bold rounded-md transition-all ${
              selected === null
                ? "bg-accent text-accent-foreground brutal-border-accent"
                : "bg-muted text-muted-foreground brutal-border hover:text-foreground"
            }`}
          >
            All
          </motion.button>
          {UNITS.map((unit) => (
            <motion.button
              key={unit}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(unit)}
              className={`min-w-[56px] px-4 py-2.5 text-sm font-bold rounded-md transition-all ${
                selected === unit
                  ? "bg-accent text-accent-foreground brutal-border-accent"
                  : "bg-muted text-muted-foreground brutal-border hover:text-foreground"
              }`}
            >
              U{unit}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnitTabs;
