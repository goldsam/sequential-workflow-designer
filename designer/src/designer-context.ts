import { BehaviorController } from './behaviors/behavior-controller';
import { ObjectCloner } from './core/object-cloner';
import { Definition } from './definition';
import { DefinitionModifier } from './definition-modifier';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerState } from './designer-state';
import { HistoryController } from './history-controller';
import { LayoutController } from './layout-controller';
import { WorkspaceController, WorkspaceControllerWrapper } from './workspace/workspace-controller';

export class DesignerContext {
	public static create(parent: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): DesignerContext {
		const definition = ObjectCloner.deepClone(startDefinition);

		const layoutController = new LayoutController(parent);
		const isMobile = layoutController.isMobile();
		const isReadonly = !!configuration.isReadonly;

		const state = new DesignerState(definition, isReadonly, isMobile, isMobile);
		const workspaceController = new WorkspaceControllerWrapper();
		const definitionModifier = new DefinitionModifier(workspaceController, state, configuration);

		let historyController: HistoryController | undefined = undefined;
		if (configuration.undoStackSize) {
			historyController = HistoryController.create(state, definitionModifier, configuration);
		}

		return new DesignerContext(
			state,
			configuration,
			layoutController,
			workspaceController,
			new BehaviorController(),
			definitionModifier,
			historyController
		);
	}

	public constructor(
		public readonly state: DesignerState,
		public readonly configuration: DesignerConfiguration,
		public readonly layoutController: LayoutController,
		public readonly workspaceController: WorkspaceControllerWrapper,
		public readonly behaviorController: BehaviorController,
		public readonly definitionModifier: DefinitionModifier,
		public readonly historyController?: HistoryController
	) {}

	public setWorkspaceController(controller: WorkspaceController) {
		this.workspaceController.set(controller);
	}
}